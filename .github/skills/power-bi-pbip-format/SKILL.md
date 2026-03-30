---
name: power-bi-pbip-format
description: >
  Power BI Project (PBIP) format reference for understanding, creating, and managing
  PBIP project structure, files, and Git workflows.
  USE WHEN: "what is PBIP", "PBIP project structure", "convert PBIX to PBIP",
  "PBIP Git workflow", ".gitignore for PBIP", "PBIP vs PBIX", "save as PBIP",
  "PBIP semantic model directory", "PBIP report directory", "thick vs thin report",
  "PBIP file types", "rename in PBIP", "PBIP validation".
  RELATED SKILLS: power-bi-tmdl-authoring, power-bi-pbir-format, power-bi-model-design-review.
---

# PBIP Format — Power BI Project Reference

You are a Power BI Project format expert. PBIP is the developer-friendly, file-based format for Power BI reports and semantic models, enabling Git-based version control, diff, merge, and collaboration.

## PBIP vs PBIX

| Aspect | PBIX | PBIP |
|--------|------|------|
| Format | Single binary ZIP file | Directory of text files |
| Version control | Binary blob, no diff | Full Git diff and merge |
| Collaboration | Merge conflicts intractable | Standard Git workflows |
| Editing | Power BI Desktop only | Any text editor + PBI Desktop |
| Size | Includes data cache | Data cache in .gitignore |
| CI/CD | Limited | Full pipeline support |

## PBIP Project Structure

A complete PBIP project consists of two main directories plus metadata:

```
MyProject/
├── MyProject.pbip                    # Project file (open in PBI Desktop)
├── MyModel.SemanticModel/            # Semantic model definition
│   ├── definition.bism               # Model connection pointer
│   ├── model.tmdl                    # Model-level properties
│   ├── definition/
│   │   ├── database.tmdl            # Database settings
│   │   ├── relationships.tmdl       # All relationships
│   │   ├── expressions.tmdl         # Shared M expressions
│   │   ├── tables/                  # One .tmdl per table
│   │   │   ├── DimDate.tmdl
│   │   │   ├── DimCustomer.tmdl
│   │   │   └── FactSales.tmdl
│   │   ├── roles/                   # One .tmdl per RLS role
│   │   │   └── SalesTerritory.tmdl
│   │   └── cultures/               # Translations (optional)
│   ├── diagramLayout.json           # Model diagram positions
│   └── .platform                    # Fabric platform metadata
├── MyReport.Report/                  # Report definition
│   ├── definition.pbir              # Report → Model connection
│   ├── report.json                  # Report settings and theme
│   ├── definition/
│   │   ├── pages/                   # One directory per page
│   │   │   └── ReportSection1/
│   │   │       ├── page.json
│   │   │       └── visuals/
│   │   │           └── {guid}/
│   │   │               └── visual.json
│   │   └── bookmarks/              # Bookmark definitions
│   ├── StaticResources/             # Embedded images, themes
│   └── .platform
└── .gitignore                       # Excludes data cache and temp files
```

## Thick vs Thin Reports

### Thick Report (Default)
The report and semantic model are bundled together in the same PBIP project. The report references the model by relative path.

```json
// definition.pbir
{
  "version": "4.0",
  "datasetReference": {
    "byPath": {
      "path": "../MyModel.SemanticModel"
    }
  }
}
```

### Thin Report
The report connects to a remote (published) semantic model. No local model directory.

```json
// definition.pbir
{
  "version": "4.0",
  "datasetReference": {
    "byConnection": {
      "connectionString": "Data Source=powerbi://api.powerbi.com/v1.0/myorg/WorkspaceName;Initial Catalog=ModelName",
      "pbiServiceModelId": null,
      "pbiModelVirtualServerName": "sobe_wowvirtualserver",
      "pbiModelDatabaseName": "abc-123-def-456",
      "name": "EntityDataSource",
      "connectionType": "pbiServiceXmlaStyleLive"
    }
  }
}
```

## Essential .gitignore

```gitignore
# Power BI cache and temp files
.pbi/
*.pbix.tmp
cache.abf
*.abf

# Local settings
.vscode/settings.json

# Auto-generated files that should not be versioned
diagramLayout.json

# Platform-specific
.platform

# OS files
.DS_Store
Thumbs.db
```

## Converting PBIX to PBIP

1. Open the `.pbix` file in Power BI Desktop
2. **File → Save As → Power BI Project (.pbip)**
3. Choose a directory for the project
4. PBI Desktop creates the full directory structure
5. Initialize Git: `git init && git add . && git commit -m "Initial PBIP conversion"`

> There is no automated CLI for PBIX→PBIP conversion. Power BI Desktop is required.

## PBIP Key Files

### .pbip (Project File)
```json
{
  "version": "1.0",
  "artifacts": [
    {
      "report": {
        "path": "MyReport.Report"
      }
    }
  ],
  "settings": {
    "enableAutoRecovery": true
  }
}
```

### .platform (Fabric Metadata)
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
  "metadata": {
    "type": "SemanticModel",
    "displayName": "MyModel"
  },
  "config": {
    "version": "2.0",
    "logicalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

### definition.bism (Model Pointer)
```json
{
  "version": "4.0",
  "settings": {}
}
```

## Renaming in PBIP

Renaming tables, columns, or measures requires updates across multiple files:

### Renaming a Table
1. Rename the `.tmdl` file: `tables/OldName.tmdl` → `tables/NewName.tmdl`
2. Update the `table` declaration inside the file
3. Update all references in `relationships.tmdl`
4. Update all references in `roles/*.tmdl` (RLS filters)
5. Update all references in `expressions.tmdl` (if referenced)
6. Update all `Entity` and `queryRef` references in `visual.json` files
7. Validate: search for old name across all `.tmdl`, `.json`, `.pbir` files

```bash
# Search for remaining references to old name
grep -r "OldTableName" --include="*.tmdl" --include="*.json" --include="*.pbir" .
```

### Renaming a Column or Measure
1. Update the declaration in the table's `.tmdl` file
2. Update all DAX references in other measures
3. Update `relationships.tmdl` if the column is a relationship key
4. Update `roles/*.tmdl` if used in RLS filters
5. Update `queryRef` and `Property` in `visual.json` files

## PBIP Validation Checklist

- [ ] `.pbip` file exists and references the correct report directory
- [ ] `definition.pbir` references the correct semantic model (path or connection)
- [ ] `model.tmdl` exists and contains valid model properties
- [ ] `relationships.tmdl` references existing table and column names
- [ ] All table `.tmdl` files are syntactically valid
- [ ] All `visual.json` files are valid JSON
- [ ] All `Entity` names in `visual.json` match table names in the model
- [ ] `.gitignore` excludes `.pbi/`, `cache.abf`, and temp files
- [ ] No BOM encoding in TMDL files
- [ ] Project opens successfully in Power BI Desktop

## Git Workflow for PBIP

### Branching Strategy
```
main ← stable, published model and report
  └── feature/add-revenue-measures ← new measures, relationships
  └── feature/redesign-dashboard ← report page changes
  └── fix/rls-filter-bug ← security fixes
```

### Merge Conflict Resolution
- **TMDL files:** Resolve as text (structured, line-based format)
- **JSON files:** Validate after merge with `jq empty` or `ConvertFrom-Json`
- **Relationships:** Be careful with conflicting relationship additions
- **Measures:** DAX expressions are plain text, standard merge applies
- **Visuals:** `visual.json` conflicts usually require choosing one version

### Pre-commit Checks
```bash
# Validate all JSON files
find . -name "*.json" -path "*.Report/*" -exec sh -c 'jq empty "$1" 2>/dev/null || echo "Invalid: $1"' _ {} \;

# Check for BOM in TMDL files
find . -name "*.tmdl" -exec sh -c 'head -c3 "$1" | od -An -tx1 | grep -q "ef bb bf" && echo "BOM: $1"' _ {} \;

# Search for orphaned references
grep -r "OldTableName" --include="*.tmdl" --include="*.json" .
```
