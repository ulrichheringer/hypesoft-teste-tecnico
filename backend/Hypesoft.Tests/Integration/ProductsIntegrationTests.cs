using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Tests.Integration;

public class ProductsIntegrationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProductsIntegrationTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ListProducts_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/products");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<PagedProductsResponse>();
        result.Should().NotBeNull();
        result!.Items.Should().NotBeNull();
    }

    [Fact]
    public async Task ListProducts_WithPagination_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/products?page=1&pageSize=10");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<PagedProductsResponse>();
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task ListProducts_WithSearch_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/products?search=test");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetProductById_WithInvalidId_ReturnsNotFound()
    {
        var response = await _client.GetAsync($"/api/products/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateProduct_WithInvalidData_ReturnsBadRequest()
    {
        var request = new CreateProductRequest("", "", -1, -1, Guid.Empty);

        var response = await _client.PostAsJsonAsync("/api/products", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateProduct_WithInvalidId_ReturnsNotFound()
    {
        var request = new UpdateProductRequest("Updated", "Desc", 10, 5, Guid.NewGuid());

        var response = await _client.PutAsJsonAsync($"/api/products/{Guid.NewGuid()}", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteProduct_WithInvalidId_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync($"/api/products/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateStock_WithInvalidId_ReturnsNotFound()
    {
        var request = new UpdateProductStockRequest(10);

        var response = await _client.PatchAsJsonAsync($"/api/products/{Guid.NewGuid()}/stock", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
