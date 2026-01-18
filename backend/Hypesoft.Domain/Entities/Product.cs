namespace Hypesoft.Domain.Entities;

public class Product
{
    private const int LowStockThreshold = 10;

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public Guid CategoryId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UnixEpoch;

    protected Product()
    {
        Name = string.Empty;
        Description = string.Empty;
    }

    public Product(
        string name,
        string description,
        decimal price,
        int stock,
        Guid categoryId)
    {
        Name = NormalizeRequired(name, nameof(name));
        Description = NormalizeRequired(description, nameof(description));
        ValidateNumbers(price, stock, categoryId);
        Id = Guid.NewGuid();
        Price = price;
        Stock = stock;
        CategoryId = categoryId;
        CreatedAt = DateTime.UtcNow;
    }

    private Product(
        Guid id,
        string name,
        string description,
        decimal price,
        int stock,
        Guid categoryId,
        DateTime createdAt)
    {
        Name = NormalizeRequired(name, nameof(name));
        Description = NormalizeRequired(description, nameof(description));
        ValidateNumbers(price, stock, categoryId);
        Id = id;
        Price = price;
        Stock = stock;
        CategoryId = categoryId;
        CreatedAt = createdAt;
    }

    public static Product Rehydrate(
        Guid id,
        string name,
        string description,
        decimal price,
        int stock,
        Guid categoryId,
        DateTime createdAt)
        => new(id, name, description, price, stock, categoryId, createdAt);

    public void Update(
        string name,
        string description,
        decimal price,
        int stock,
        Guid categoryId)
    {
        Name = NormalizeRequired(name, nameof(name));
        Description = NormalizeRequired(description, nameof(description));
        ValidateNumbers(price, stock, categoryId);
        Price = price;
        Stock = stock;
        CategoryId = categoryId;
    }

    public void UpdateStock(int stock)
    {
        if (stock < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(stock), "Stock cannot be negative.");
        }

        Stock = stock;
    }

    public bool IsLowStock()
    {
        return Stock < LowStockThreshold;
    }

    private static string NormalizeRequired(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"{fieldName} is required.", fieldName);
        }

        return value.Trim();
    }

    private static void ValidateNumbers(decimal price, int stock, Guid categoryId)
    {
        if (price <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(price), "Price must be greater than zero.");
        }

        if (stock < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(stock), "Stock cannot be negative.");
        }

        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException("categoryId is required.", nameof(categoryId));
        }
    }
}
