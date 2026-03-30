---
name: power-bi-fabric-cli
description: >
  Microsoft Fabric CLI (fab) reference for remote operations on Power BI and Fabric
  workspaces, semantic models, reports, and capacities.
  USE WHEN: "fabric CLI", "fab command", "deploy to workspace", "export TMDL remotely",
  "publish report", "refresh dataset API", "workspace operations", "fabric REST API",
  "migrate workspace", "capacity management", "fabric deployment pipeline",
  "list workspaces", "download semantic model", "trigger refresh".
  RELATED SKILLS: power-bi-semantic-model-refresh, power-bi-pbip-format, power-bi-lineage-analysis.
---

# Fabric CLI — Remote Operations Reference

You are a Microsoft Fabric CLI expert. The Fabric CLI (`fab`) enables remote management of Power BI and Fabric workspaces, semantic models, reports, pipelines, and capacities from the command line.

## Installation

```bash
# Install via pip
pip install azure-fabric-cli

# Or via npm (Node.js wrapper)
npm install -g @microsoft/fabric-cli

# Authenticate
fab login
```

## Core Commands

### Workspace Operations

```bash
# List workspaces
fab workspace list

# Get workspace details
fab workspace show --workspace-id <guid>

# Create workspace
fab workspace create --name "Sales Analytics Dev" --capacity-id <guid>

# Assign workspace to capacity
fab workspace assign-capacity --workspace-id <guid> --capacity-id <guid>
```

### Semantic Model Operations

```bash
# List semantic models in workspace
fab dataset list --workspace-id <guid>

# Export model to TMDL folder
fab dataset export-tmdl --workspace-id <guid> --dataset-id <guid> --output ./exported-model

# Deploy TMDL to workspace
fab dataset deploy-tmdl --workspace-id <guid> --source ./MyModel.SemanticModel

# Trigger refresh
fab dataset refresh --workspace-id <guid> --dataset-id <guid>

# Check refresh status
fab dataset refresh-history --workspace-id <guid> --dataset-id <guid> --top 5
```

### Report Operations

```bash
# List reports in workspace
fab report list --workspace-id <guid>

# Download report (PBIR)
fab report export --workspace-id <guid> --report-id <guid> --output ./exported-report

# Rebind report to different dataset
fab report rebind --workspace-id <guid> --report-id <guid> --dataset-id <new-guid>
```

### Deployment Pipelines

```bash
# List pipelines
fab pipeline list

# Deploy stage (Dev → Test → Prod)
fab pipeline deploy --pipeline-id <guid> --source-stage Dev --target-stage Test

# Check deployment status
fab pipeline operation-status --pipeline-id <guid> --operation-id <guid>
```

## Fabric REST API (PowerShell)

When the CLI is not available, use the REST API directly:

### Authentication

```powershell
# Interactive login
$token = (Get-AzAccessToken -ResourceUrl "https://analysis.windows.net/powerbi/api").Token

# Service principal
$body = @{
    grant_type    = "client_credentials"
    client_id     = $env:FABRIC_CLIENT_ID
    client_secret = $env:FABRIC_CLIENT_SECRET
    resource      = "https://analysis.windows.net/powerbi/api"
}
$token = (Invoke-RestMethod -Uri "https://login.microsoftonline.com/$tenantId/oauth2/token" -Method POST -Body $body).access_token

$headers = @{ "Authorization" = "Bearer $token" }
```

### Workspace Management

```powershell
# List workspaces
$workspaces = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups" -Headers $headers
$workspaces.value | Select-Object name, id, type

# Get workspace details
$ws = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId" -Headers $headers
```

### Dataset Operations

```powershell
# List datasets in workspace
$datasets = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets" -Headers $headers

# Trigger refresh
Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes" `
    -Headers $headers `
    -Method POST `
    -Body '{"type": "full"}' `
    -ContentType "application/json"

# Get refresh history
$refreshes = Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/refreshes?`$top=5" `
    -Headers $headers
$refreshes.value | Select-Object status, startTime, endTime
```

### Report Management

```powershell
# List reports
$reports = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/reports" -Headers $headers

# Get downstream artifacts (lineage)
$downstream = Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/datasets/$datasetId/upstreamDataflows" `
    -Headers $headers
```

### XMLA Endpoint (Advanced)

For direct model access via XMLA:

```powershell
# Connection string format
$connectionString = "Data Source=powerbi://api.powerbi.com/v1.0/myorg/$workspaceName;Initial Catalog=$datasetName"

# Use with ADOMD.NET or TOM libraries for programmatic model access
```

## Common Workflows

### CI/CD Deployment Pattern

```bash
# 1. Export current production model as baseline
fab dataset export-tmdl --workspace-id $PROD_WS --dataset-id $PROD_DS --output ./baseline

# 2. Deploy updated model to dev
fab dataset deploy-tmdl --workspace-id $DEV_WS --source ./MyModel.SemanticModel

# 3. Trigger refresh in dev
fab dataset refresh --workspace-id $DEV_WS --dataset-id $DEV_DS

# 4. Run BPA validation (Tabular Editor)
TabularEditor.exe ./MyModel.SemanticModel/model.tmdl -A bpa-rules.json -O results.txt

# 5. If validation passes, promote to test
fab pipeline deploy --pipeline-id $PIPELINE --source-stage Dev --target-stage Test
```

### Workspace Migration

```powershell
# 1. List source workspace artifacts
$sourceReports = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$sourceWs/reports" -Headers $headers
$sourceDatasets = Invoke-RestMethod -Uri "https://api.powerbi.com/v1.0/myorg/groups/$sourceWs/datasets" -Headers $headers

# 2. Export each dataset
foreach ($ds in $sourceDatasets.value) {
    fab dataset export-tmdl --workspace-id $sourceWs --dataset-id $ds.id --output "./export/$($ds.name)"
}

# 3. Deploy to target workspace
foreach ($folder in Get-ChildItem ./export -Directory) {
    fab dataset deploy-tmdl --workspace-id $targetWs --source $folder.FullName
}
```

## Validation Checklist

- [ ] Authentication configured (interactive or service principal)
- [ ] Correct workspace ID and dataset ID used
- [ ] API permissions granted (Dataset.ReadWrite.All, Workspace.ReadWrite.All)
- [ ] Refresh triggered and monitored after deployment
- [ ] BPA validation passed before production deployment
- [ ] Rollback plan defined (keep baseline TMDL export)
