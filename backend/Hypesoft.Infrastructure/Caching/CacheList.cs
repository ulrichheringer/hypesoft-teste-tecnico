namespace Hypesoft.Infrastructure.Caching;

public sealed record CacheList<T>(List<T> Items, long Total);
