---
name: power-bi-semantic-model-refresh
description: >
  Manage Power BI semantic model refresh operations: trigger, monitor, schedule,
  and troubleshoot data refreshes via REST API and Power BI service.
  USE WHEN: "trigger refresh", "refresh history", "schedule refresh",
  "refresh failed", "incremental refresh", "refresh timeout", "refresh API",
  "monitor refresh status", "cancel refresh", "refresh troubleshooting",
  "enhanced refresh API", "XMLA refresh".
  RELATED SKILLS: power-bi-fabric-cli, power-bi-performance-troubleshooting.
---

# Semantic Model Refresh — Management & Troubleshooting

You are a Power BI refresh management expert. Your role is to configure, trigger, monitor, and troubleshoot data refresh operations for semantic models.

## Refresh Methods

| Method | Use Case | Prerequisites |
|--------|----------|---------------|
| Power BI Service UI | Manual one-off refresh | Workspace access |
| REST API | Automated/programmatic refresh | API permissions |
| Enhanced Refresh API | Advanced control (partitions, objects) | Premium/Fabric capacity |
| XMLA Endpoint | Full TOM control, partition management | Premium/Fabric P1+ |
| Fabric CLI (`fab`) | Command-line refresh | Fabric CLI installed |

## REST API — Standard Refresh

### Trigger Refresh

```powershell
$headers = @{ "Authorization" = "Bearer $token" }

# Simple full refresh
Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
    -Headers $headers `
    -Method POST `
    -Body '{"type": "full"}' `
    -ContentType "application/json"
```

### Check Refresh Status

```powershell
$refreshes = Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes?`$top=5" `
    -Headers $headers

$refreshes.value | ForEach-Object {
    [PSCustomObject]@{
        Status    = $_.status
        StartTime = $_.startTime
        EndTime   = $_.endTime
        Type      = $_.refreshType
        Duration  = if ($_.endTime) {
            (([DateTime]$_.endTime) - ([DateTime]$_.startTime)).ToString("hh\:mm\:ss")
        } else { "In progress..." }
    }
} | Format-Table
```

### Get Refresh Schedule

```powershell
$schedule = Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshSchedule" `
    -Headers $headers

Write-Host "Enabled: $($schedule.enabled)"
Write-Host "Frequency: $($schedule.days -join ', ') at $($schedule.times -join ', ')"
Write-Host "Timezone: $($schedule.localTimeZoneId)"
```

## Enhanced Refresh API (Premium/Fabric)

### Selective Refresh (Specific Tables)

```powershell
$body = @{
    type = "full"
    objects = @(
        @{ table = "FactSales" },
        @{ table = "DimCustomer" }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
    -Headers $headers `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Partition-Level Refresh

```powershell
$body = @{
    type = "full"
    objects = @(
        @{
            table = "FactSales"
            partition = "FactSales-2024"
        }
    )
} | ConvertTo-Json -Depth 3
```

### Refresh with Apply Policy (Incremental)

```powershell
$body = @{
    type = "full"
    applyRefreshPolicy = $true    # Honor incremental refresh policy
    effectiveDate = "2024-01-01"  # Override RangeEnd for testing
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
    -Headers $headers `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Monitor Enhanced Refresh

```powershell
# Get operation ID from response header
$response = Invoke-WebRequest `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
    -Headers $headers `
    -Method POST `
    -Body '{"type": "full"}' `
    -ContentType "application/json"

$operationId = ($response.Headers['x-ms-request-id'])

# Poll status
do {
    Start-Sleep -Seconds 10
    $status = Invoke-RestMethod `
        -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
        -Headers $headers
    $latest = $status.value[0]
    Write-Host "Status: $($latest.status) | Started: $($latest.startTime)"
} while ($latest.status -eq "Unknown" -or $latest.status -eq "InProgress")

Write-Host "Final: $($latest.status) | Duration: $(([DateTime]$latest.endTime - [DateTime]$latest.startTime).ToString('hh\:mm\:ss'))"
```

## Incremental Refresh Configuration

### Setup in Power Query

```m
// Required parameters (Power BI manages these automatically)
RangeStart = #datetime(2024, 1, 1, 0, 0, 0) meta [
    IsParameterQuery = true,
    IsParameterQueryRequired = true,
    Type = "DateTime"
],
RangeEnd = #datetime(2024, 12, 31, 0, 0, 0) meta [
    IsParameterQuery = true,
    IsParameterQueryRequired = true,
    Type = "DateTime"
],

// Use in query filter (MUST fold to source)
FilteredSales = Table.SelectRows(Sales,
    each [OrderDateTime] >= RangeStart and [OrderDateTime] < RangeEnd)
```

### Incremental Refresh Policy

Configured in Power BI Desktop → Table → Incremental refresh:

| Setting | Recommendation |
|---------|---------------|
| Archive data starting | 3-5 years (based on data volume) |
| Incrementally refresh starting | 30 days (rolling window) |
| Only refresh complete days | ✅ Enable for consistency |
| Detect data changes | ✅ If source supports `MAX(ModifiedDate)` |

## Troubleshooting

### Common Refresh Failures

| Error | Cause | Fix |
|-------|-------|-----|
| `Credentials expired` | OAuth token expired | Reconfigure data source credentials |
| `Gateway offline` | On-premises gateway unreachable | Check gateway service status |
| `Timeout expired` | Query takes >2 hours | Optimize Power Query, use incremental refresh |
| `Memory exceeded` | Model too large for capacity | Reduce model size, upgrade capacity |
| `Data source error` | Source unavailable or schema changed | Verify source connectivity and schema |
| `Refresh already in progress` | Concurrent refresh attempt | Wait for current refresh to complete |

### Diagnostic Steps

1. **Check refresh history** — look for error messages in the service
2. **Test credentials** — Edit data source → Test connection
3. **Check gateway status** — Manage gateways → verify online
4. **Review query folding** — ensure filters push to source
5. **Monitor capacity** — check CPU/memory during refresh
6. **Test in Desktop** — refresh locally to isolate service vs source issues

## Validation Checklist

- [ ] Data source credentials configured and valid
- [ ] Gateway online (for on-premises sources)
- [ ] Refresh schedule configured with appropriate frequency
- [ ] Incremental refresh policy set for large tables
- [ ] RangeStart/RangeEnd parameters fold to data source
- [ ] Refresh completes within timeout (2 hours standard, 5 hours enhanced)
- [ ] Monitoring/alerting configured for refresh failures
- [ ] Error handling in Power Query for transient source issues
