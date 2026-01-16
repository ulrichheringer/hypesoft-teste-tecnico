using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Hypesoft.API.Auth;

public sealed class JwtBearerWarmupService(
    IOptionsMonitor<JwtBearerOptions> options,
    ILogger<JwtBearerWarmupService> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var jwtOptions = options.Get(JwtBearerDefaults.AuthenticationScheme);
        var manager = jwtOptions.ConfigurationManager;
        if (manager is null)
        {
            logger.LogWarning("JwtBearer configuration manager not available");
            return;
        }

        try
        {
            await manager.GetConfigurationAsync(cancellationToken);
            logger.LogInformation("JwtBearer metadata warmed up");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to warm up JwtBearer metadata");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
