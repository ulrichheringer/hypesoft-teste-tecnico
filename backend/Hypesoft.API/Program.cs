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

// DbContext MongoDB EF Core Provider
var mongoConn = builder.Configuration["Mongo:ConnectionString"]!;
var mongoDb = builder.Configuration["Mongo:Database"]!;

builder.Services.AddDbContext<HypesoftDbContext>(options =>
{
    options.UseMongoDB(mongoConn, mongoDb);
});

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Hypesoft.Application.DTOs.CategoryDto).Assembly));

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
