using Hypesoft.API.Observability;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/rum")]
[AllowAnonymous]
public sealed class RumController(RumMetrics metrics) : ControllerBase
{
    [HttpPost]
    public IActionResult Record([FromBody] WebVitalPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Name))
        {
            return BadRequest("Metric name is required.");
        }

        metrics.Record(payload);
        return Accepted();
    }
}
