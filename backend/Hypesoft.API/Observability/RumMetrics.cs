using System.Diagnostics.Metrics;

namespace Hypesoft.API.Observability;

public sealed class RumMetrics
{
    public const string MeterName = "Hypesoft.Rum";

    private static readonly Meter Meter = new(MeterName);
    private readonly Histogram<double> webVitalHistogram =
        Meter.CreateHistogram<double>("rum.web_vital", unit: "ms", description: "Frontend web vitals");

    public void Record(WebVitalPayload payload)
    {
        webVitalHistogram.Record(
            payload.Value,
            new KeyValuePair<string, object?>("metric", payload.Name),
            new KeyValuePair<string, object?>("rating", payload.Rating));
    }
}

public sealed record WebVitalPayload(
    string Name,
    double Value,
    string Rating);
