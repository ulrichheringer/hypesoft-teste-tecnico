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

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();

// DbContext MongoDB EF Core Provider
var mongoConn = builder.Configuration["Mongo:ConnectionString"]!;
var mongoDb = builder.Configuration["Mongo:Database"]!;

builder.Services.AddDbContext<HypesoftDbContext>(options =>
{
    options.UseMongoDB(mongoConn, mongoDb);
});

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Hypesoft.Application.DTOs.CategoryDto).Assembly));

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(Hypesoft.Application.Validators.Categories.CreateCategoryRequestValidator).Assembly);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();