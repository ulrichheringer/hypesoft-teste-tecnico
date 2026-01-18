using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Tests.Integration;

public class DashboardIntegrationTests : IClassFixture<TestWebApplicationFactory>, IAsyncLifetime
{
    private readonly TestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public DashboardIntegrationTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync() => await _factory.CleanupDatabaseAsync();

    [Fact]
    public async Task GetDashboardSummary_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/dashboard");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<DashboardSummaryDto>();
        result.Should().NotBeNull();
    }
}
