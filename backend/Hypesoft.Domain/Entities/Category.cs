namespace Hypesoft.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }

    protected Category()
    {
        Name = string.Empty;
    }

    public Category(string name)
    {
        Id = Guid.NewGuid();
        Name = NormalizeRequired(name, nameof(name));
    }

    private Category(Guid id, string name)
    {
        Id = id;
        Name = NormalizeRequired(name, nameof(name));
    }

    public static Category Rehydrate(Guid id, string name)
        => new(id, name);

    public void Rename(string name)
    {
        Name = NormalizeRequired(name, nameof(name));
    }

    private static string NormalizeRequired(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"{fieldName} is required.", fieldName);
        }

        return value.Trim();
    }
}
