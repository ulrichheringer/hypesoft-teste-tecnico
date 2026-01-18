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
using Hypesoft.API.Auth;
using Hypesoft.API.OpenApi;
using Hypesoft.API.Middlewares;
using Hypesoft.Application.Mapping;
using Hypesoft.API.Observability;
using Prometheus;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;
using QuestPDF.Infrastructure;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:5000");

QuestPDF.Settings.License = LicenseType.Community;

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

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hypesoft API",
        Version = "v1",
        Description = "API de Gestão de Produtos - Sistema Hypesoft"
    });
    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT obtido do Keycloak"
    });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();
builder.Services.AddHealthChecks();
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? Array.Empty<string>();
var allowAnyOrigin = corsOrigins.Length == 0;

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
        policy.AllowCredentials();
    });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddOptions();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

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

var redisConnection = builder.Configuration.GetValue<string>("Redis:ConnectionString") ?? "localhost:6379";
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnection;
});

try
{
    Metrics.DefaultRegistry.SetStaticLabels(new Dictionary<string, string>
    {
        { "app", "hypesoft-api" }
    });
}
catch (InvalidOperationException)
{
}

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Hypesoft.Application.DTOs.CategoryDto).Assembly));
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(Hypesoft.Application.Validators.Categories.CreateCategoryRequestValidator).Assembly);

var keycloakAuthority = builder.Configuration["Keycloak:Authority"]!;
var keycloakAudience = builder.Configuration["Keycloak:Audience"]!;
var requireHttpsMetadata = builder.Configuration.GetValue("Keycloak:RequireHttpsMetadata", true);
var keycloakAdditionalIssuers = builder.Configuration
    .GetSection("Keycloak:AdditionalIssuers")
    .Get<string[]>() ?? [];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.Audience = keycloakAudience;
        options.RequireHttpsMetadata = requireHttpsMetadata;
        if (keycloakAdditionalIssuers.Length > 0)
        {
            options.TokenValidationParameters.ValidIssuers = new[]
                { keycloakAuthority }
                .Concat(keycloakAdditionalIssuers)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }
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
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Hypesoft API v1");
        options.RoutePrefix = "swagger";
        options.DocumentTitle = "Hypesoft API - Swagger UI";
        options.EnablePersistAuthorization();
    });
}

app.UseSecurityHeaders();
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
app.UseHttpMetrics(options =>
{
    options.AddCustomLabel("host", context => context.Request.Host.Host);
});
app.MapMetrics();
app.MapControllers().RequireCors("Frontend");

app.Run();

public partial class Program { }
