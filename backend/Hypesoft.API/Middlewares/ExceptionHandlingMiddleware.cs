using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Middlewares;

public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex) when (!context.Response.HasStarted)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        switch (ex)
        {
            case ValidationException validationException:
                logger.LogWarning(validationException, "Validation failed");
                await WriteValidationProblemAsync(context, validationException);
                return;
            case KeyNotFoundException notFoundException:
                logger.LogWarning(notFoundException, "Resource not found");
                await WriteProblemAsync(context, StatusCodes.Status404NotFound, "Not found", notFoundException.Message);
                return;
            default:
                logger.LogError(ex, "Unhandled exception");
                await WriteProblemAsync(context, StatusCodes.Status500InternalServerError, "Unexpected error", "An unexpected error occurred.");
                return;
        }
    }

    private async Task WriteValidationProblemAsync(HttpContext context, ValidationException ex)
    {
        var errors = ex.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray());

        var problem = new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation failed",
            Instance = context.Request.Path
        };

        AddCommonExtensions(context, problem.Extensions);

        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(problem, JsonOptions));
    }

    private async Task WriteProblemAsync(HttpContext context, int statusCode, string title, string detail)
    {
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path
        };

        AddCommonExtensions(context, problem.Extensions);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(problem, JsonOptions));
    }

    private static void AddCommonExtensions(HttpContext context, IDictionary<string, object?> extensions)
    {
        if (context.Response.Headers.TryGetValue("X-Correlation-Id", out var correlationId))
        {
            extensions["correlationId"] = correlationId.ToString();
        }

        extensions["traceId"] = context.TraceIdentifier;
    }
}
