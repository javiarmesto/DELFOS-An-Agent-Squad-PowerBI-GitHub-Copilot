---
name: power-bi-deneb-visuals
description: >
  Deneb custom visual creation using Vega and Vega-Lite specifications in Power BI.
  Covers spec authoring, data binding, theming, interactivity, and PBIR integration.
  USE WHEN: "create Deneb visual", "Vega-Lite in Power BI", "Deneb specification",
  "custom chart with Deneb", "Vega spec for Power BI", "Deneb data binding",
  "Deneb theme integration", "Deneb cross-filtering", "Deneb tooltip",
  "bullet chart Deneb", "KPI card Deneb", "waffle chart", "lollipop chart".
  RELATED SKILLS: power-bi-pbir-format, power-bi-report-design-consultation.
---

# Deneb Visuals — Vega & Vega-Lite in Power BI

You are an expert in creating Deneb custom visuals for Power BI using Vega and Vega-Lite specifications. Deneb enables declarative, grammar-of-graphics-based visualizations directly within Power BI reports.

## When to Use Deneb

| Use Deneb When | Use Native Visuals When |
|----------------|------------------------|
| Standard visuals can't express the chart type | Bar, line, pie, table covers the need |
| You need pixel-level control over design | Default styling is acceptable |
| Custom animations or interactions needed | Standard cross-filtering is sufficient |
| Complex layered/faceted visualizations | Simple single-series charts |
| Specific brand compliance requirements | Theme-based styling works |

## Provider Selection

**Prefer Vega-Lite** unless you need Vega-specific features:

| Feature | Vega-Lite | Vega |
|---------|-----------|------|
| Learning curve | Lower | Higher |
| Conciseness | More compact specs | Verbose but flexible |
| Layouts | Built-in facets, layers | Manual positioning |
| Interactions | Declarative selections | Custom signal handling |
| Complex animations | Limited | Full control |
| Custom shapes/paths | Limited | Full SVG path support |

**Deneb bundled runtime:** Vega 6.2.0 / Vega-Lite 6.4.1 (Deneb 1.8+)

## Vega-Lite Spec Structure

### Basic Pattern

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "name": "dataset" },
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "Category",
      "type": "nominal",
      "axis": { "labelAngle": -45 }
    },
    "y": {
      "field": "Total Sales",
      "type": "quantitative",
      "axis": { "format": "$,.0f" }
    },
    "color": {
      "value": { "expr": "pbiColor(0)" }
    }
  }
}
```

**Key rules:**
- `"data": { "name": "dataset" }` — always use `"dataset"` to bind to Power BI fields
- Field names must match the column/measure names added to the Deneb visual's data wells
- Use `pbiColor(index)` for theme-aware colors

### Layered Visualization

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "name": "dataset" },
  "layer": [
    {
      "mark": { "type": "bar", "opacity": 0.7 },
      "encoding": {
        "x": { "field": "Month", "type": "ordinal" },
        "y": { "field": "Revenue", "type": "quantitative" }
      }
    },
    {
      "mark": { "type": "line", "color": "firebrick", "strokeWidth": 2 },
      "encoding": {
        "x": { "field": "Month", "type": "ordinal" },
        "y": { "field": "Target", "type": "quantitative" }
      }
    },
    {
      "mark": { "type": "point", "color": "firebrick", "size": 60 },
      "encoding": {
        "x": { "field": "Month", "type": "ordinal" },
        "y": { "field": "Target", "type": "quantitative" }
      }
    }
  ]
}
```

### Faceted (Small Multiples)

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "name": "dataset" },
  "facet": {
    "field": "Region",
    "type": "nominal",
    "columns": 3
  },
  "spec": {
    "width": 200,
    "height": 150,
    "mark": "line",
    "encoding": {
      "x": { "field": "Date", "type": "temporal" },
      "y": { "field": "Sales", "type": "quantitative" }
    }
  }
}
```

## Theme Integration

### Power BI Theme Colors

Use `pbiColor(index)` to reference the active Power BI theme palette:

```json
{
  "color": { "value": { "expr": "pbiColor(0)" } },
  "fill":  { "value": { "expr": "pbiColor(1)" } }
}
```

| Index | Typical Color | Usage |
|-------|---------------|-------|
| 0 | Primary | Main data series |
| 1 | Secondary | Comparison series |
| 2 | Tertiary | Third series |
| 3-7 | Extended palette | Additional series |

### Conditional Colors

```json
{
  "color": {
    "condition": {
      "test": "datum['Variance'] >= 0",
      "value": "#2E8B57"
    },
    "value": "#DC143C"
  }
}
```

## Interactivity

### Cross-Filtering

Enable Power BI cross-filtering with the `__selected__` field:

```json
{
  "mark": { "type": "bar" },
  "encoding": {
    "opacity": {
      "condition": {
        "test": "datum['__selected__'] == 'on'",
        "value": 1
      },
      "value": 0.3
    }
  }
}
```

### Tooltips

Use Power BI's native tooltip by enabling it in Deneb's visual settings (Format pane → Tooltip → Default). To add custom tooltip fields:

```json
{
  "encoding": {
    "tooltip": [
      { "field": "Category", "type": "nominal" },
      { "field": "Total Sales", "type": "quantitative", "format": "$,.0f" },
      { "field": "Growth %", "type": "quantitative", "format": ".1%" }
    ]
  }
}
```

### Context Menu

Power BI's right-click context menu (drill-through, see records) is automatically available on Deneb visuals when cross-filtering is enabled.

## Responsive Sizing

Use Deneb's container signals for responsive width/height:

```json
{
  "width": { "signal": "pbiContainerWidth" },
  "height": { "signal": "pbiContainerHeight" },
  "autosize": { "type": "fit", "contains": "padding" }
}
```

## Common Chart Recipes

### Bullet Chart

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "name": "dataset" },
  "layer": [
    {
      "mark": { "type": "bar", "color": "#e0e0e0" },
      "encoding": {
        "x": { "field": "Target", "type": "quantitative", "title": null },
        "y": { "field": "Metric", "type": "nominal" }
      }
    },
    {
      "mark": { "type": "bar", "color": { "expr": "pbiColor(0)" } },
      "encoding": {
        "x": { "field": "Actual", "type": "quantitative" },
        "y": { "field": "Metric", "type": "nominal" }
      }
    },
    {
      "mark": { "type": "tick", "color": "black", "thickness": 3, "size": 20 },
      "encoding": {
        "x": { "field": "Target", "type": "quantitative" },
        "y": { "field": "Metric", "type": "nominal" }
      }
    }
  ]
}
```

### Lollipop Chart

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "name": "dataset" },
  "layer": [
    {
      "mark": { "type": "rule", "strokeWidth": 2 },
      "encoding": {
        "y": { "field": "Category", "type": "nominal", "sort": "-x" },
        "x": { "field": "Value", "type": "quantitative" }
      }
    },
    {
      "mark": { "type": "circle", "size": 150, "color": { "expr": "pbiColor(0)" } },
      "encoding": {
        "y": { "field": "Category", "type": "nominal", "sort": "-x" },
        "x": { "field": "Value", "type": "quantitative" }
      }
    }
  ]
}
```

## PBIR Integration

When adding a Deneb visual directly in PBIR (not through the UI):

### Visual Registration in report.json

Add the Deneb custom visual to the report's registered visuals:

```json
{
  "publicCustomVisuals": [
    "deneb7E15AEF80B9E4D4F8E12924291ECE89A"
  ]
}
```

### visual.json for Deneb

```json
{
  "visual": {
    "visualType": "deneb7E15AEF80B9E4D4F8E12924291ECE89A",
    "query": {
      "queryState": {
        "Values": {
          "projections": [
            {
              "field": {
                "Column": {
                  "Expression": { "SourceRef": { "Entity": "DimProduct" } },
                  "Property": "Category"
                }
              },
              "queryRef": "DimProduct.Category"
            },
            {
              "field": {
                "Measure": {
                  "Expression": { "SourceRef": { "Entity": "FactSales" } },
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
      "vega": [
        {
          "properties": {
            "jsonSpec": {
              "expr": {
                "Literal": {
                  "Value": "'{\"$schema\":\"https://vega.github.io/schema/vega-lite/v5.json\",\"data\":{\"name\":\"dataset\"},\"mark\":\"bar\",\"encoding\":{\"x\":{\"field\":\"Category\",\"type\":\"nominal\"},\"y\":{\"field\":\"Total Sales\",\"type\":\"quantitative\"}}}'"
                }
              }
            },
            "provider": { "expr": { "Literal": { "Value": "'vegaLite'" } } }
          }
        }
      ]
    }
  }
}
```

**Escaping rules for PBIR:**
- The entire JSON spec is wrapped in a string literal inside `Value`
- Single quotes wrap the outer string: `"Value": "'...spec...'"`
- Inner double quotes remain as-is (they're inside the single-quoted string)

## Validation Checklist

- [ ] `"data": { "name": "dataset" }` used (not inline data)
- [ ] Field names match Power BI data well names exactly
- [ ] `pbiColor()` used for theme-aware colors
- [ ] Responsive sizing via `pbiContainerWidth`/`pbiContainerHeight` signals
- [ ] Cross-filtering uses `__selected__` field
- [ ] Spec is valid JSON (test with a JSON validator)
- [ ] Visual renders correctly in Power BI Desktop
- [ ] Tooltip configuration matches expected fields
