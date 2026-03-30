---
name: power-bi-pbir-format
description: >
  Power BI Report (PBIR) format reference for authoring and editing report metadata
  files directly. Covers report.json, visual.json, page structure, and JSON schemas.
  USE WHEN: "edit PBIR file", "modify report.json", "add visual to report",
  "PBIR page structure", "edit visual configuration", "report theme in PBIR",
  "PBIR JSON schema", "add page to PBIR report", "visual binding configuration",
  "fix corrupted PBIR", "PBIR format reference".
  PRIORITY: Use MCP Modeling tools or Power BI Desktop first. Direct PBIR editing
  is fragile and should be done carefully.
  RELATED SKILLS: power-bi-pbip-format, power-bi-tmdl-authoring, power-bi-report-design-consultation.
---

# PBIR Format — Report Metadata Reference

You are a Power BI report format expert. PBIR (Power BI Report) is the JSON-based file format that defines report pages, visuals, filters, and interactions in PBIP (Power BI Project) format.

> **WARNING:** The PBIR format is brittle. Malformed JSON or incorrect property values
> can corrupt the report and prevent it from opening in Power BI Desktop.
> Always validate JSON after every modification.

## PBIR Directory Structure

```
*.Report/
├── definition.pbir          # Report definition pointer (semantic model reference)
├── report.json              # Report-level settings (theme, filters, pages list)
├── StaticResources/
│   └── SharedResources/
│       └── BaseThemes/
│           └── CY24SU11.json  # Base theme definition
└── definition/
    ├── pages/
    │   ├── ReportSection1/
    │   │   ├── page.json      # Page-level config (name, size, background)
    │   │   └── visuals/
    │   │       ├── {visualGuid1}/
    │   │       │   └── visual.json  # Individual visual definition
    │   │       └── {visualGuid2}/
    │   │           └── visual.json
    │   └── ReportSection2/
    │       ├── page.json
    │       └── visuals/
    └── bookmarks/             # Bookmark definitions (optional)
```

## Key Files

### definition.pbir

Connects the report to its semantic model:

```json
{
  "version": "4.0",
  "datasetReference": {
    "byPath": {
      "path": "../MyModel.SemanticModel"
    },
    "byConnection": null
  }
}
```

### report.json

Report-level configuration:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/1.0.0/schema.json",
  "themeCollection": {
    "baseTheme": {
      "name": "CY24SU11",
      "reportVersionAtImport": "5.56",
      "type": "SharedResources"
    }
  },
  "defaultDrillFilterOtherVisuals": true,
  "linguisticSchemaSyncVersion": 2,
  "settings": {
    "isPersistentUserStateDisabled": true
  }
}
```

### page.json

Page-level settings:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/1.0.0/schema.json",
  "name": "ReportSection1",
  "displayName": "Sales Overview",
  "displayOption": "fitToPage",
  "height": 720.00,
  "width": 1280.00,
  "background": {
    "color": {
      "solid": {
        "color": "#FFFFFF"
      }
    },
    "transparency": 0
  },
  "wallpaper": {
    "color": {
      "solid": {
        "color": "#F2F2F2"
      }
    },
    "transparency": 0
  }
}
```

### visual.json

Individual visual definition:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visual/1.0.0/schema.json",
  "name": "a1b2c3d4e5f6",
  "position": {
    "x": 40.00,
    "y": 60.00,
    "z": 1000,
    "width": 600.00,
    "height": 400.00,
    "tabOrder": 0
  },
  "visual": {
    "visualType": "clusteredBarChart",
    "query": {
      "queryState": {
        "Category": {
          "projections": [
            {
              "field": {
                "Column": {
                  "Expression": {
                    "SourceRef": { "Entity": "DimProduct" }
                  },
                  "Property": "Category"
                }
              },
              "queryRef": "DimProduct.Category",
              "active": true
            }
          ]
        },
        "Y": {
          "projections": [
            {
              "field": {
                "Measure": {
                  "Expression": {
                    "SourceRef": { "Entity": "FactSales" }
                  },
                  "Property": "Total Sales"
                }
              },
              "queryRef": "FactSales.Total Sales"
            }
          ]
        }
      }
    },
    "objects": {
      "title": [
        {
          "properties": {
            "text": { "expr": { "Literal": { "Value": "'Sales by Category'" } } },
            "show": { "expr": { "Literal": { "Value": "true" } } }
          }
        }
      ]
    }
  },
  "filterConfig": {
    "filters": []
  }
}
```

## Common Visual Types

| `visualType` Value | Visual | Typical Data Wells |
|-------------------|--------|-------------------|
| `clusteredBarChart` | Clustered Bar | Category, Y |
| `clusteredColumnChart` | Clustered Column | Category, Y |
| `lineChart` | Line | Category, Y, Series |
| `pieChart` | Pie | Category, Y |
| `donutChart` | Donut | Category, Y |
| `card` | Card | Fields |
| `multiRowCard` | Multi-row Card | Fields |
| `tableEx` | Table | Values |
| `pivotTable` | Matrix | Rows, Columns, Values |
| `map` | Map | Location, Size, Legend |
| `filledMap` | Filled Map | Location, Color saturation |
| `slicer` | Slicer | Fields |
| `treemap` | Treemap | Group, Values |
| `waterfallChart` | Waterfall | Category, Y |
| `kpi` | KPI | Indicator, Trend, Target |
| `gauge` | Gauge | Value, Target, Min, Max |
| `scatterChart` | Scatter | X, Y, Size, Legend |
| `areaChart` | Area | Category, Y, Series |

## queryRef Format

The `queryRef` field follows the pattern `Entity.Property`:

```
DimProduct.Category        → Column reference
FactSales.Total Sales      → Measure reference
DimDate.Year               → Column reference
```

**Rules:**
- Use the table name (Entity) as it appears in the semantic model
- Use the column/measure name (Property) as it appears in the model
- Spaces are allowed without quoting (unlike DAX)

## Field Binding Patterns

### Column Binding
```json
{
  "field": {
    "Column": {
      "Expression": {
        "SourceRef": { "Entity": "TableName" }
      },
      "Property": "ColumnName"
    }
  },
  "queryRef": "TableName.ColumnName"
}
```

### Measure Binding
```json
{
  "field": {
    "Measure": {
      "Expression": {
        "SourceRef": { "Entity": "TableName" }
      },
      "Property": "MeasureName"
    }
  },
  "queryRef": "TableName.MeasureName"
}
```

## Validation Checklist

After every PBIR edit:

- [ ] Run `ConvertFrom-Json` (PowerShell) or `jq empty` (Bash) on every modified JSON file
- [ ] Verify `$schema` URLs are present and correct
- [ ] Verify `Entity` names match table names in the semantic model exactly
- [ ] Verify `Property` names match column/measure names exactly
- [ ] Verify `queryRef` follows `Entity.Property` format
- [ ] Verify `position` fields have valid numeric values
- [ ] Verify visual GUIDs are unique across the page
- [ ] Open the .pbip project in Power BI Desktop to confirm rendering
- [ ] Take a backup before making extensive changes

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Trailing comma in JSON | Report won't open | Remove trailing commas |
| Wrong `Entity` name | Visual shows error | Match exact table name from model |
| Missing `$schema` | May work but not validated | Add correct schema URL |
| Duplicate visual GUID | Visual overlap/missing | Generate unique GUID per visual |
| Invalid `visualType` | Blank visual area | Use exact values from the table above |
| Broken `queryRef` | Data not bound | Match `Entity.Property` exactly |
