namespace Hypesoft.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }

    protected Category() { }

    public Category(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
    }

    public void Rename(string name)
    {
        Name = name;
    }
}