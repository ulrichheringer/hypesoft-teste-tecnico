using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Tests.Integration;

public class DashboardIntegrationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public DashboardIntegrationTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetDashboardSummary_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/dashboard");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<DashboardSummaryDto>();
        result.Should().NotBeNull();
    }
}
