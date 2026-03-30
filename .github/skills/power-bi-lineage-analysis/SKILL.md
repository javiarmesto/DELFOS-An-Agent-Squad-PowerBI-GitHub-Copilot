---
name: power-bi-lineage-analysis
description: >
  Power BI lineage and impact analysis for tracing data flow from sources through
  semantic models to downstream reports and dashboards.
  USE WHEN: "downstream reports from model", "impact analysis", "what uses this table",
  "lineage analysis", "dependency trace", "which reports use this measure",
  "change impact assessment", "data lineage Power BI", "upstream data sources",
  "before renaming check dependencies", "who consumes this dataset".
  RELATED SKILLS: power-bi-model-design-review, power-bi-naming-conventions, power-bi-pbip-format.
---

# Power BI Lineage & Impact Analysis

You are a Power BI lineage analysis expert. Your role is to trace data flow and dependencies across the Power BI ecosystem to enable safe change management, rename operations, and impact assessments.

## When to Perform Lineage Analysis

- **Before renaming** tables, columns, or measures — to find all dependents
- **Before deleting** objects — to confirm nothing references them
- **Before refactoring** the model — to understand downstream impact
- **During migration** — to map current state before changes
- **For documentation** — to produce dependency maps for stakeholders

## Analysis Scope

### Upstream Lineage (Data Sources → Model)

Trace where data comes from:

```
Data Sources (SQL Server, APIs, Files)
    ↓
Power Query (M expressions, transformations)
    ↓
Semantic Model Tables (imported/DirectQuery)
    ↓
Calculated Columns & Measures (DAX)
```

### Downstream Lineage (Model → Consumers)

Trace what depends on the model:

```
Semantic Model
    ↓
├── Power BI Reports (visuals, pages, filters)
├── Paginated Reports (RDL using this dataset)
├── Excel Workbooks (Analyze in Excel connections)
├── Other Semantic Models (chained/composite models)
└── Third-party tools (XMLA endpoint consumers)
```

## Intra-Model Dependency Analysis

### Step 1: Table Dependencies

Identify which tables reference each other via relationships and DAX:

```
Check for each table:
□ Relationships (fromColumn, toColumn in relationships.tmdl)
□ DAX references (measures using RELATED, RELATEDTABLE, CALCULATE with table filters)
□ Calculation groups (SELECTEDMEASURE() affects all measures)
□ RLS filters (role expressions referencing the table)
```

### Step 2: Column Dependencies

For a specific column, identify all references:

```
Column dependency checklist:
□ Relationships using this column (relationships.tmdl)
□ Measures referencing Table[Column] (all table .tmdl files)
□ Calculated columns referencing this column
□ RLS expressions using this column (roles/*.tmdl)
□ Sort-by-column references (sortByColumn property)
□ Hierarchies including this column
□ Report visuals binding to this column (visual.json queryRef)
□ Report filters using this column
□ Slicers bound to this column
```

### Step 3: Measure Dependencies

For a specific measure, identify all references:

```
Measure dependency checklist:
□ Other measures referencing [MeasureName]
□ Calculation group items using SELECTEDMEASURE()
□ KPI definitions using this measure
□ Report visuals binding to this measure (visual.json queryRef)
□ Conditional formatting rules referencing this measure
□ Report-level or page-level filters on this measure
```

## Cross-Artifact Dependency Analysis

### Using Fabric REST API (PowerShell)

When running in a Fabric workspace, use the REST API for downstream analysis:

```powershell
# Get downstream reports for a semantic model
$workspaceId = "your-workspace-guid"
$datasetId = "your-dataset-guid"

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json"
}

# Get reports in workspace
$reports = Invoke-RestMethod `
    -Uri "https://api.powerbi.com/v1.0/myorg/groups/$workspaceId/reports" `
    -Headers $headers

# Filter reports connected to this dataset
$dependentReports = $reports.value | Where-Object { $_.datasetId -eq $datasetId }

foreach ($report in $dependentReports) {
    Write-Host "Report: $($report.name) (ID: $($report.id))"
}
```

### Using PBIP File Search (Local)

For local PBIP projects, search file content:

```bash
# Find all references to a table name across the project
grep -r "DimCustomer" --include="*.tmdl" --include="*.json" --include="*.pbir" .

# Find all visual.json files that reference a specific measure
grep -rl "Total Sales" --include="visual.json" .

# Find all DAX references to a column
grep -r "FactSales\[Amount\]" --include="*.tmdl" .

# Find relationship references
grep -r "DimDate.DateKey" --include="*.tmdl" .
```

### Using DAX Queries via MCP (Connected Model)

Query the model metadata for dependencies:

```dax
// Find all measures and their expressions (search for references)
EVALUATE
SELECTCOLUMNS(
    INFO.MEASURES(),
    "Table", [TableName],
    "Measure", [Name],
    "Expression", [Expression]
)

// Find all relationships involving a specific table
EVALUATE
FILTER(
    INFO.RELATIONSHIPS(),
    [FromTableName] = "FactSales" || [ToTableName] = "FactSales"
)

// Find all columns in a table (to check if any are unused)
EVALUATE
SELECTCOLUMNS(
    FILTER(INFO.COLUMNS(), [TableName] = "DimCustomer"),
    "Column", [Name],
    "DataType", [DataType],
    "IsHidden", [IsHidden]
)
```

## Impact Assessment Report

Generate the report with this format:

```
📊 Lineage & Impact Analysis Report
════════════════════════════════════

🎯 Object Under Analysis
   Type:    {Table | Column | Measure | Relationship}
   Name:    {full qualified name}
   Table:   {parent table}

🔼 Upstream Dependencies
   {list of data sources, M expressions, columns feeding this object}

🔽 Downstream Dependencies (Intra-Model)
   Measures referencing:   {N} measures
   Calculated columns:     {N} columns
   Relationships:          {N} relationships
   RLS roles:              {N} roles
   Hierarchies:            {N} hierarchies

🔽 Downstream Dependencies (Cross-Artifact)
   Report visuals:         {N} visuals across {N} pages
   Report filters:         {N} filters
   Slicers:                {N} slicers
   External reports:       {N} (if workspace access available)

⚠️ Change Risk Assessment
   Risk Level:  {Low | Medium | High | Critical}
   Breaking changes: {list of changes that would break dependents}
   Safe changes:     {list of changes that are backward-compatible}

📋 Action Plan (if renaming/deleting)
   1. {ordered list of files to update}
   2. {validation steps}
   3. {testing steps}
```

## Common Scenarios

### Safe Rename Workflow

1. **Analyze** — run lineage analysis on the object
2. **Document** — record all dependencies found
3. **Plan** — order the updates (model first, reports second)
4. **Execute** — rename in all locations (use search-and-replace across files)
5. **Validate** — grep for old name to ensure no orphaned references
6. **Test** — open in Power BI Desktop and verify all visuals render

### Orphaned Object Detection

Find objects with no downstream references:

```
Potentially orphaned:
□ Columns not referenced by any measure, relationship, or visual
□ Measures not referenced by any other measure or visual
□ Tables not connected by any relationship
□ Relationships marked as inactive with no USERELATIONSHIP in DAX
□ Roles with no tablePermission filters
```

## Validation Checklist

- [ ] All upstream data sources identified
- [ ] All intra-model references traced (DAX, relationships, RLS)
- [ ] All report visual bindings checked (queryRef in visual.json)
- [ ] Change risk level assessed
- [ ] Action plan produced for proposed changes
- [ ] Orphaned objects flagged for review
