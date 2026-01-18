using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Hypesoft.Infrastructure.Data;

namespace Hypesoft.Tests.Integration;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private const string TestDatabaseName = "hypesoft_test";
    private const string MongoConnectionString = "mongodb://localhost:27017";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Remove ALL DbContext-related registrations
            var descriptorsToRemove = services
                .Where(d => 
                    d.ServiceType == typeof(DbContextOptions<HypesoftDbContext>) ||
                    d.ServiceType == typeof(HypesoftDbContext) ||
                    d.ServiceType.FullName?.Contains("DbContextOptions") == true)
                .ToList();

            foreach (var descriptor in descriptorsToRemove)
            {
                services.Remove(descriptor);
            }

            // Register fresh DbContext with test database using connection string
            services.AddDbContext<HypesoftDbContext>((sp, options) =>
            {
                options.UseMongoDB(MongoConnectionString, TestDatabaseName);
            }, ServiceLifetime.Scoped);

            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", _ => { });

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder("Test")
                    .RequireAuthenticatedUser()
                    .Build();

                options.AddPolicy("Admin", policy =>
                    policy.RequireAuthenticatedUser());

                options.AddPolicy("User", policy =>
                    policy.RequireAuthenticatedUser());
            });
        });
    }

    public async Task CleanupDatabaseAsync()
    {
        var mongoClient = new MongoClient(MongoConnectionString);
        await mongoClient.DropDatabaseAsync(TestDatabaseName);
    }
}

public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "TestUser"),
            new Claim(ClaimTypes.Role, "admin"),
            new Claim("realm_access", """{"roles":["admin"]}""")
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
