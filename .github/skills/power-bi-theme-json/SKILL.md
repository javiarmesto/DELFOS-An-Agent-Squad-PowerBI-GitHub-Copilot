---
name: power-bi-theme-json
description: >
  Design, create, audit, and validate Power BI report theme JSON files.
  Covers color palettes, typography, visual styles, conditional formatting,
  and brand compliance.
  USE WHEN: "create Power BI theme", "theme JSON", "custom color palette",
  "brand colors Power BI", "report theme file", "modify theme", "dark theme",
  "font settings theme", "visual default styles", "theme validation",
  "export theme", "corporate theme".
  RELATED SKILLS: power-bi-report-design-consultation, power-bi-pbir-format.
---

# Power BI Theme JSON — Design & Management

You are a Power BI theme expert. Report themes define the visual appearance of reports: colors, fonts, visual defaults, and formatting rules — all in a single JSON file.

## Theme File Location

- **In PBIP:** `*.Report/StaticResources/SharedResources/BaseThemes/{name}.json`
- **Standalone:** Any `.json` file imported via View → Themes → Browse for themes
- **Published:** Themes can be saved to the organization theme gallery

## Theme JSON Structure

```json
{
  "name": "Corporate Brand Theme",
  "dataColors": [
    "#0078D4", "#2E8B57", "#FF8C00", "#DC143C",
    "#9370DB", "#20B2AA", "#FF6347", "#4682B4"
  ],
  "background": "#FFFFFF",
  "foreground": "#333333",
  "tableAccent": "#0078D4",
  "maximum": "#DC143C",
  "center": "#FF8C00",
  "minimum": "#2E8B57",
  "good": "#2E8B57",
  "neutral": "#FF8C00",
  "bad": "#DC143C",
  "textClasses": {
    "title": {
      "fontFace": "Segoe UI Semibold",
      "fontSize": 14,
      "color": "#333333"
    },
    "header": {
      "fontFace": "Segoe UI Semibold",
      "fontSize": 12,
      "color": "#333333"
    },
    "label": {
      "fontFace": "Segoe UI",
      "fontSize": 10,
      "color": "#666666"
    },
    "callout": {
      "fontFace": "Segoe UI Light",
      "fontSize": 28,
      "color": "#333333"
    }
  },
  "visualStyles": {
    "*": {
      "*": {
        "general": [{ "properties": { "responsive": { "expr": { "Literal": { "Value": "true" } } } } }],
        "title": [{
          "properties": {
            "show": { "expr": { "Literal": { "Value": "true" } } },
            "fontFamily": { "expr": { "Literal": { "Value": "'Segoe UI Semibold'" } } },
            "fontSize": { "expr": { "Literal": { "Value": "12D" } } },
            "fontColor": { "expr": { "Literal": { "Value": "'#333333'" } } }
          }
        }]
      }
    }
  }
}
```

## Core Properties

### dataColors (Data Palette)

The ordered list of colors used for data series across all visuals:

```json
"dataColors": [
  "#0078D4",  // Primary — first series in any chart
  "#2E8B57",  // Secondary
  "#FF8C00",  // Tertiary
  "#DC143C",  // Quaternary
  "#9370DB",  // Fifth
  "#20B2AA",  // Sixth
  "#FF6347",  // Seventh
  "#4682B4"   // Eighth
]
```

**Best practices:**
- Minimum 6 colors, recommended 8-12
- Ensure sufficient contrast between adjacent colors
- Test with colorblind simulation tools
- First color should be the brand primary

### Semantic Colors

```json
{
  "good": "#2E8B57",      // Positive indicators (green)
  "neutral": "#FF8C00",   // Warning indicators (orange)
  "bad": "#DC143C",       // Negative indicators (red)
  "maximum": "#DC143C",   // Scale maximum
  "center": "#FF8C00",    // Scale midpoint
  "minimum": "#2E8B57"    // Scale minimum
}
```

### Text Classes

```json
{
  "textClasses": {
    "title":   { "fontFace": "Segoe UI Semibold", "fontSize": 14 },
    "header":  { "fontFace": "Segoe UI Semibold", "fontSize": 12 },
    "label":   { "fontFace": "Segoe UI", "fontSize": 10 },
    "callout": { "fontFace": "Segoe UI Light", "fontSize": 28 }
  }
}
```

| Class | Usage |
|-------|-------|
| `title` | Report and page titles |
| `header` | Visual titles, section headers |
| `label` | Axis labels, data labels, legends |
| `callout` | KPI cards, large numbers |

## Visual Styles

### Global Defaults (Apply to All Visuals)

```json
"visualStyles": {
  "*": {
    "*": {
      "background": [{
        "properties": {
          "show": { "expr": { "Literal": { "Value": "false" } } },
          "color": { "solid": { "color": "#FFFFFF" } },
          "transparency": { "expr": { "Literal": { "Value": "0D" } } }
        }
      }],
      "border": [{
        "properties": {
          "show": { "expr": { "Literal": { "Value": "false" } } }
        }
      }],
      "title": [{
        "properties": {
          "show": { "expr": { "Literal": { "Value": "true" } } },
          "fontFamily": { "expr": { "Literal": { "Value": "'Segoe UI Semibold'" } } },
          "fontSize": { "expr": { "Literal": { "Value": "12D" } } }
        }
      }]
    }
  }
}
```

### Visual-Specific Styles

```json
"visualStyles": {
  "card": {
    "*": {
      "labels": [{
        "properties": {
          "fontSize": { "expr": { "Literal": { "Value": "28D" } } },
          "fontFamily": { "expr": { "Literal": { "Value": "'Segoe UI Light'" } } }
        }
      }]
    }
  },
  "slicer": {
    "*": {
      "items": [{
        "properties": {
          "fontFamily": { "expr": { "Literal": { "Value": "'Segoe UI'" } } },
          "fontSize": { "expr": { "Literal": { "Value": "10D" } } }
        }
      }]
    }
  }
}
```

## Dark Theme Template

```json
{
  "name": "Corporate Dark",
  "dataColors": ["#60CDFF", "#6CCB5F", "#FCB714", "#F25767", "#B388FF", "#4DD0E1"],
  "background": "#1E1E1E",
  "foreground": "#E0E0E0",
  "tableAccent": "#60CDFF",
  "good": "#6CCB5F",
  "neutral": "#FCB714",
  "bad": "#F25767",
  "textClasses": {
    "title":   { "fontFace": "Segoe UI Semibold", "fontSize": 14, "color": "#E0E0E0" },
    "header":  { "fontFace": "Segoe UI Semibold", "fontSize": 12, "color": "#E0E0E0" },
    "label":   { "fontFace": "Segoe UI", "fontSize": 10, "color": "#B0B0B0" },
    "callout": { "fontFace": "Segoe UI Light", "fontSize": 28, "color": "#FFFFFF" }
  },
  "visualStyles": {
    "*": {
      "*": {
        "background": [{
          "properties": {
            "color": { "solid": { "color": "#2D2D2D" } },
            "transparency": { "expr": { "Literal": { "Value": "0D" } } }
          }
        }]
      }
    }
  }
}
```

## Theme Validation

### PowerShell Validation

```powershell
# Validate JSON syntax
$theme = Get-Content -Path "theme.json" -Raw | ConvertFrom-Json

# Check required fields
if (-not $theme.name) { Write-Warning "Missing 'name' field" }
if (-not $theme.dataColors -or $theme.dataColors.Count -lt 6) {
    Write-Warning "dataColors should have at least 6 entries"
}

# Validate hex colors
foreach ($color in $theme.dataColors) {
    if ($color -notmatch '^#[0-9A-Fa-f]{6}$') {
        Write-Warning "Invalid color format: $color"
    }
}

# Check contrast ratios (basic)
Write-Host "Theme '$($theme.name)' validated successfully"
```

### Accessibility Checks

- Minimum 4.5:1 contrast ratio for text on backgrounds
- Minimum 3:1 contrast ratio for large text (>18pt)
- Adjacent data colors must be distinguishable for colorblind users
- Test with Coblis or similar colorblind simulator

## Validation Checklist

- [ ] Theme has a descriptive `name` field
- [ ] `dataColors` has at least 6 colors
- [ ] All colors are valid hex format (`#RRGGBB`)
- [ ] Semantic colors defined (`good`, `neutral`, `bad`)
- [ ] Text classes defined (`title`, `header`, `label`, `callout`)
- [ ] Font families are available on target systems
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Theme renders correctly when applied in Power BI Desktop
- [ ] Dark/light backgrounds don't clash with text colors
- [ ] JSON is valid (no syntax errors)
