using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace Hypesoft.Infrastructure.Caching;

public static class DistributedCacheExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task<T?> GetRecordAsync<T>(
        this IDistributedCache cache,
        string key,
        CancellationToken ct = default)
    {
        try
        {
            var payload = await cache.GetAsync(key, ct);
            if (payload is null)
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(payload, JsonOptions);
        }
        catch
        {
            return default;
        }
    }

    public static Task SetRecordAsync<T>(
        this IDistributedCache cache,
        string key,
        T value,
        DistributedCacheEntryOptions options,
        CancellationToken ct = default)
    {
        try
        {
            var payload = JsonSerializer.SerializeToUtf8Bytes(value, JsonOptions);
            return cache.SetAsync(key, payload, options, ct);
        }
        catch
        {
            return Task.CompletedTask;
        }
    }

    public static async Task<string?> GetStringSafeAsync(
        this IDistributedCache cache,
        string key,
        CancellationToken ct = default)
    {
        try
        {
            return await cache.GetStringAsync(key, ct);
        }
        catch
        {
            return null;
        }
    }

    public static Task SetStringSafeAsync(
        this IDistributedCache cache,
        string key,
        string value,
        DistributedCacheEntryOptions options,
        CancellationToken ct = default)
    {
        try
        {
            return cache.SetStringAsync(key, value, options, ct);
        }
        catch
        {
            return Task.CompletedTask;
        }
    }

    public static Task RemoveSafeAsync(
        this IDistributedCache cache,
        string key,
        CancellationToken ct = default)
    {
        try
        {
            return cache.RemoveAsync(key, ct);
        }
        catch
        {
            return Task.CompletedTask;
        }
    }
}
