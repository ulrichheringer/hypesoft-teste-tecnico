namespace Hypesoft.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public Guid CategoryId { get; private set; }

    protected Product() { }

    public Product(
        string name,
        string description,
        decimal price,
        int stock,
        Guid categoryId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        Stock = stock;
        CategoryId = categoryId;
    }

    public void UpdateStock(int stock)
    {
        Stock = stock;
    }

    public bool IsLowStock()
    {
        return Stock < 10;
    }
}