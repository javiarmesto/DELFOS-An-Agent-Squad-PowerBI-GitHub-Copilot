---
name: power-bi-svg-visuals
description: >
  SVG visuals via DAX measures in Power BI. Create inline SVG graphics rendered
  as Image URL measures for KPI indicators, sparklines, progress bars, and icons.
  USE WHEN: "SVG in DAX", "inline SVG measure", "SVG visual Power BI",
  "KPI icon DAX", "progress bar SVG", "sparkline DAX", "conditional icon",
  "traffic light indicator", "star rating visual", "SVG data URI".
  RELATED SKILLS: power-bi-deneb-visuals, power-bi-report-design-consultation.
---

# SVG Visuals via DAX — Inline Graphics in Measures

You are an expert in creating SVG visuals embedded in DAX measures for Power BI. This technique renders SVG graphics as Image URL measures, enabling pixel-perfect KPI indicators, sparklines, progress bars, and custom icons.

## How It Works

Power BI can render SVG in Image URL fields. The DAX measure returns a data URI:

```
"data:image/svg+xml;utf8," & <SVG string>
```

This renders as an inline image in Table, Matrix, Card, and Multi-row Card visuals.

## Basic Pattern

```dax
SVG Indicator =
VAR _Value = [Total Sales]
VAR _Target = [Sales Target]
VAR _Pct = DIVIDE(_Value, _Target, 0)
VAR _Color =
    SWITCH(
        TRUE(),
        _Pct >= 1, "#2E8B57",    -- Green: on target
        _Pct >= 0.8, "#FF8C00",  -- Orange: close
        "#DC143C"                  -- Red: behind
    )
VAR _SVG =
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'>
        <circle cx='10' cy='10' r='8' fill='" & _Color & "'/>
    </svg>"
RETURN
    _SVG
```

**Key rules:**
- Use single quotes `'` inside SVG attributes (DAX strings use double quotes `"`)
- The `data:image/svg+xml;utf8,` prefix is required
- Set the measure's Data Category to **Image URL** in the model
- Maximum ~32,000 characters per SVG string (DAX string limit)

## Setting Data Category

In TMDL:
```tmdl
measure 'SVG Indicator' = ...
    dataCategory: ImageUrl
```

In Power BI Desktop: Measure → Column Tools → Data Category → Image URL

## Recipes

### Traffic Light Indicator

```dax
Traffic Light =
VAR _Status = [Status Score]
VAR _Color =
    SWITCH(
        TRUE(),
        _Status >= 90, "#2E8B57",
        _Status >= 70, "#FF8C00",
        "#DC143C"
    )
RETURN
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
        <circle cx='12' cy='12' r='10' fill='" & _Color & "'/>
    </svg>"
```

### Progress Bar

```dax
Progress Bar =
VAR _Pct = MIN([Completion %], 1)
VAR _Width = 100
VAR _BarWidth = ROUND(_Pct * _Width, 0)
VAR _Color =
    SWITCH(TRUE(), _Pct >= 1, "#2E8B57", _Pct >= 0.5, "#4682B4", "#DC143C")
RETURN
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='" & _Width & "' height='16'>
        <rect x='0' y='2' width='" & _Width & "' height='12' rx='6' fill='#E0E0E0'/>
        <rect x='0' y='2' width='" & _BarWidth & "' height='12' rx='6' fill='" & _Color & "'/>
        <text x='" & _Width / 2 & "' y='12' text-anchor='middle'
              font-size='9' font-family='Segoe UI' fill='white'>"
        & FORMAT(_Pct, "0%") & "</text>
    </svg>"
```

### Star Rating (1-5)

```dax
Star Rating =
VAR _Rating = ROUND([Avg Rating], 0)
VAR _Stars =
    REPT(
        "<text font-size='16' fill='#FFD700'>★</text>",
        _Rating
    ) &
    REPT(
        "<text font-size='16' fill='#D3D3D3'>★</text>",
        5 - _Rating
    )
RETURN
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'>
        <text x='0' y='16' font-size='16' font-family='Segoe UI'>"
        & REPT("★", _Rating) & REPT("☆", 5 - _Rating)
        & "</text>
    </svg>"
```

### Trend Arrow

```dax
Trend Arrow =
VAR _Change = [Sales YoY %]
VAR _Color = IF(_Change >= 0, "#2E8B57", "#DC143C")
VAR _Rotation = IF(_Change >= 0, "0", "180")
RETURN
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
        <polygon points='12,2 22,18 2,18' fill='" & _Color & "'
                 transform='rotate(" & _Rotation & ",12,12)'/>
    </svg>"
```

### Sparkline (Mini Line Chart)

```dax
Sparkline =
VAR _Table =
    ADDCOLUMNS(
        SUMMARIZE(FactSales, DimDate[MonthNum]),
        "@Sales", [Total Sales]
    )
VAR _MaxVal = MAXX(_Table, [@Sales])
VAR _MinVal = MINX(_Table, [@Sales])
VAR _Range = _MaxVal - _MinVal
VAR _Width = 120
VAR _Height = 30
VAR _Points =
    CONCATENATEX(
        _Table,
        VAR _X = (DimDate[MonthNum] - 1) * (_Width / 11)
        VAR _Y = _Height - DIVIDE([@Sales] - _MinVal, _Range, 0) * _Height
        RETURN _X & "," & _Y,
        " ",
        DimDate[MonthNum], ASC
    )
RETURN
    "data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='" & _Width & "' height='" & _Height & "'>
        <polyline points='" & _Points & "' fill='none' stroke='#4682B4' stroke-width='2'/>
    </svg>"
```

## Supported Visuals

| Visual | SVG Rendering | Notes |
|--------|--------------|-------|
| Table | ✅ | Best support, renders in cells |
| Matrix | ✅ | Renders in value cells |
| Card | ✅ | Set measure as Image URL |
| Multi-row Card | ✅ | Set measure as Image URL |
| Other visuals | ❌ | SVG not rendered in charts |

## Performance Considerations

- Keep SVG under 32K characters (DAX string limit)
- Avoid complex paths with many points (>100 data points)
- Use simple shapes (`rect`, `circle`, `polygon`, `text`) over complex `path` elements
- Cache intermediate calculations in VAR statements
- For dense sparklines, limit to 12-24 data points

## Validation Checklist

- [ ] Measure Data Category set to `ImageUrl`
- [ ] SVG uses single quotes for attributes
- [ ] `xmlns='http://www.w3.org/2000/svg'` included
- [ ] `data:image/svg+xml;utf8,` prefix present
- [ ] Colors use hex values (not named colors for reliability)
- [ ] SVG renders correctly in Table/Matrix visual
- [ ] Total SVG string under 32K characters
- [ ] No unescaped special characters (`<`, `>`, `&`) in text content
