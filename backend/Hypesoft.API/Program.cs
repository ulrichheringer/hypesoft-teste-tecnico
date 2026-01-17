using Scalar.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Scalar;
using Hypesoft.API.Auth;
using Hypesoft.API.OpenApi;
using Hypesoft.API.Middlewares;
using Hypesoft.Application.Interfaces;
using Hypesoft.API.Observability;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, _, configuration) =>
{
    configuration
        .MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "Hypesoft.API")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .WriteTo.Console(new JsonFormatter());
});

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<KeycloakSecurityDocumentTransformer>();
});
builder.Services.AddControllers();
builder.Services.AddHealthChecks();
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? Array.Empty<string>();
var allowAnyOrigin = builder.Configuration.GetValue("Cors:AllowAnyOrigin", builder.Environment.IsDevelopment())
    || corsOrigins.Length == 0
    || corsOrigins.Any(origin => string.Equals(origin, "*", StringComparison.Ordinal));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (allowAnyOrigin)
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins(corsOrigins);
        }

        policy.AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddOptions();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// DbContext MongoDB EF Core Provider
var mongoConn = builder.Configuration["Mongo:ConnectionString"]!;
var mongoDb = builder.Configuration["Mongo:Database"]!;

builder.Services.AddDbContext<HypesoftDbContext>(options =>
{
    options.UseMongoDB(mongoConn, mongoDb);
});

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddSingleton<RumMetrics>();

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("Hypesoft.API"))
    .WithMetrics(metrics =>
    {
        metrics.AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddRuntimeInstrumentation()
            .AddMeter(RumMetrics.MeterName)
            .AddPrometheusExporter();
    });

builder.Services.AddMediatR(typeof(Hypesoft.Application.DTOs.CategoryDto).Assembly);

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(Hypesoft.Application.Validators.Categories.CreateCategoryRequestValidator).Assembly);

var keycloakAuthority = builder.Configuration["Keycloak:Authority"]!;
var keycloakAudience = builder.Configuration["Keycloak:Audience"]!;
var requireHttpsMetadata = builder.Configuration.GetValue("Keycloak:RequireHttpsMetadata", true);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.Audience = keycloakAudience;
        options.RequireHttpsMetadata = requireHttpsMetadata;
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("admin", "Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("user", "User", "admin", "Admin"));
});

builder.Services.AddScoped<IClaimsTransformation, KeycloakRolesClaimsTransformation>();
builder.Services.AddHostedService<JwtBearerWarmupService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging();
app.UseCors("Frontend");
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseIpRateLimiting();
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health");
app.MapPrometheusScrapingEndpoint();
app.MapControllers().RequireCors("Frontend");

app.Run();
