using Hypesoft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;

namespace Hypesoft.Infrastructure.Data;

public sealed class HypesoftDbContext(DbContextOptions<HypesoftDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories { get; init; } = null!;
    public DbSet<Product> Products { get; init; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().ToCollection("categories");
        modelBuilder.Entity<Product>().ToCollection("products");
    }
}