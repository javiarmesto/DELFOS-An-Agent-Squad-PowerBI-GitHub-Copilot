---
name: power-bi-tmdl-authoring
description: >
  Advanced TMDL (Tabular Model Definition Language) authoring reference for creating
  and editing semantic model files directly. Covers syntax, encoding, object types,
  properties, and structural patterns.
  USE WHEN: "edit TMDL file", "create table in TMDL", "add measure to TMDL",
  "TMDL syntax error", "fix TMDL encoding", "convert BIM to TMDL",
  "TMDL relationship syntax", "TMDL column properties", "write TMDL from scratch",
  "TMDL indentation rules", "TMDL description annotation".
  PRIORITY: Use MCP tools first. This skill is for direct file editing as last resort.
  RELATED SKILLS: power-bi-pbip-format, power-bi-pbir-format, power-bi-model-design-review.
---

# TMDL Authoring — Advanced Reference

You are a TMDL authoring expert. TMDL (Tabular Model Definition Language) is the file-based representation of Power BI semantic models used in PBIP (Power BI Project) format.

> **IMPORTANT:** Direct TMDL file editing is a **last resort**. Always prefer:
> 1. MCP Modeling tools (safest, encoding-correct)
> 2. Tabular Editor CLI (if available)
> 3. Direct file editing with this skill (requires UTF-8 without BOM)

## TMDL File Structure

A PBIP semantic model directory contains these TMDL files:

```
*.SemanticModel/
├── model.tmdl              # Model-level properties, annotations, cultures
├── definition/
│   ├── database.tmdl       # Database compatibility level, annotations
│   ├── relationships.tmdl  # All relationships between tables
│   ├── expressions.tmdl    # Shared M expressions (parameters, functions)
│   ├── roles/              # One .tmdl per security role
│   │   └── {RoleName}.tmdl
│   ├── perspectives/       # One .tmdl per perspective
│   │   └── {PerspectiveName}.tmdl
│   ├── cultures/           # One .tmdl per translation culture
│   │   └── {locale}.tmdl
│   └── tables/             # One .tmdl per table
│       └── {TableName}.tmdl
```

## Syntax Rules

### Indentation

TMDL uses **semantic indentation with tabs** (not spaces):

```tmdl
table DimCustomer                    // Level 0 — no indent
	column CustomerKey               // Level 1 — 1 tab
		dataType: int64              // Level 2 — 2 tabs
		isKey: true
		summarizeBy: none
	column CustomerName
		dataType: string
		summarizeBy: none
```

**Rules:**
- Always use **tab characters**, never spaces
- Indentation depth = nesting level (child objects indent 1 tab more than parent)
- Properties are indented 1 level deeper than their parent object

### Name Quoting

Use single quotes for names containing spaces, special characters, or starting with digits:

```tmdl
table 'Sales Order'
	column 'Order ID'
	measure '% Growth'
	column '2024 Target'
```

Names without special characters do not need quotes:

```tmdl
table DimDate
	column DateKey
	measure TotalSales
```

### Descriptions (Triple-Slash Annotations)

Use `///` for object descriptions (not `//` which is a comment):

```tmdl
/// Customer dimension table containing demographic and contact information.
table DimCustomer

	/// Unique surrogate key for each customer.
	column CustomerKey
		dataType: int64
		isKey: true
		summarizeBy: none

	/// Total revenue across all transactions for this customer.
	measure 'Total Revenue' = SUM(FactSales[Amount])
		formatString: \$#,0.00;(\$#,0.00);\$#,0.00
```

### Comments

Use `//` for inline comments:

```tmdl
// This table stores daily aggregated metrics
table FactDailyMetrics
	column MetricValue  // Aggregated at day grain
		dataType: double
```

## Object Type Reference

### Tables

```tmdl
table FactSales
	lineageTag: a1b2c3d4-e5f6-7890-abcd-ef1234567890

	partition 'FactSales-partition' = m
		mode: import
		source =
			let
				Source = Sql.Database("server", "database"),
				Sales = Source{[Schema="dbo", Item="Sales"]}[Data]
			in
				Sales

	column SalesKey
		dataType: int64
		isKey: true
		summarizeBy: none
		lineageTag: 12345678-abcd-ef01-2345-67890abcdef0

	column Amount
		dataType: double
		summarizeBy: sum
		formatString: \$#,0.00;(\$#,0.00);\$#,0.00

	column Quantity
		dataType: int64
		summarizeBy: sum

	measure 'Total Sales' = SUM(FactSales[Amount])
		formatString: \$#,0.00;(\$#,0.00);\$#,0.00
		displayFolder: Revenue

	measure 'Sales YTD' =
		TOTALYTD(
			[Total Sales],
			DimDate[Date]
		)
		formatString: \$#,0.00;(\$#,0.00);\$#,0.00
		displayFolder: Revenue
```

### Columns — Property Reference

| Property | Values | Required | Notes |
|----------|--------|----------|-------|
| `dataType` | `int64`, `double`, `string`, `boolean`, `dateTime`, `decimal` | Yes | Always specify |
| `isKey` | `true`, `false` | No | Primary key flag |
| `summarizeBy` | `sum`, `count`, `min`, `max`, `average`, `none` | Yes | Use `none` for keys, text, dates |
| `formatString` | Format pattern | No | Number/date display format |
| `isHidden` | `true`, `false` | No | Hide from report view |
| `isNameInferred` | `true`, `false` | No | Name derived from source |
| `isDataTypeInferred` | `true`, `false` | No | Type derived from source |
| `sortByColumn` | Column name | No | For sort-by-another-column |
| `dataCategory` | `Address`, `City`, `Country`, etc. | No | Geo and categorization |
| `displayFolder` | Folder path | No | Organize in field list |
| `lineageTag` | GUID | Auto | Generated by PBI Desktop |

### Measures

Inline (single expression):
```tmdl
measure 'Total Sales' = SUM(FactSales[Amount])
	formatString: \$#,0.00;(\$#,0.00);\$#,0.00
```

Multi-line (indented block):
```tmdl
measure 'Sales vs Budget' =
	VAR CurrentSales = [Total Sales]
	VAR BudgetAmount = [Total Budget]
	VAR Variance = CurrentSales - BudgetAmount
	RETURN
		DIVIDE(Variance, BudgetAmount, 0)
	formatString: 0.00%;-0.00%;0.00%
	displayFolder: Comparison
```

### Relationships

```tmdl
// In relationships.tmdl
relationship rel_FactSales_DimDate
	fromColumn: FactSales.DateKey
	toColumn: DimDate.DateKey
	crossFilteringBehavior: singleDirection

relationship rel_FactSales_DimCustomer
	fromColumn: FactSales.CustomerKey
	toColumn: DimCustomer.CustomerKey
	crossFilteringBehavior: singleDirection

// Inactive relationship
relationship rel_FactSales_DimDate_Ship
	fromColumn: FactSales.ShipDateKey
	toColumn: DimDate.DateKey
	crossFilteringBehavior: singleDirection
	isActive: false
```

### Roles (RLS)

```tmdl
// In roles/SalesTerritory.tmdl
role SalesTerritory

	modelPermission: read

	tablePermission DimTerritory = [TerritoryEmail] = USERPRINCIPALNAME()
```

### Calculation Groups

```tmdl
table 'Time Intelligence'
	calculationGroup

	column Name
		dataType: string
		isNameInferred: true
		isDataTypeInferred: true
		sourceColumn: Name

	calculationItem 'Current' =
		SELECTEDMEASURE()
		ordinal: 0

	calculationItem YTD =
		TOTALYTD(
			SELECTEDMEASURE(),
			DimDate[Date]
		)
		ordinal: 1

	calculationItem 'Prior Year' =
		CALCULATE(
			SELECTEDMEASURE(),
			SAMEPERIODLASTYEAR(DimDate[Date])
		)
		ordinal: 2
```

### Partitions (M Source Expressions)

```tmdl
partition 'DimCustomer-partition' = m
	mode: import
	source =
		let
			Source = Sql.Database("server.database.windows.net", "AdventureWorks"),
			dbo_Customer = Source{[Schema="dbo", Item="Customer"]}[Data],
			#"Renamed Columns" = Table.RenameColumns(dbo_Customer, {
				{"CustomerID", "CustomerKey"},
				{"FullName", "CustomerName"}
			})
		in
			#"Renamed Columns"
```

**M expression rules in TMDL:**
- The `=` after `source` starts the M block
- M expression is indented with tabs (matching TMDL indentation)
- No closing delimiter — the block ends when indentation returns to the partition level
- Strings inside M use double quotes `"` (not single quotes)

## Encoding Rules

**CRITICAL:** TMDL files must be saved as **UTF-8 without BOM** (Byte Order Mark).

### Why BOM is Dangerous
- Power BI Desktop cannot parse TMDL files with BOM markers
- Standard file-write tools in most editors add BOM by default
- A BOM-corrupted file will cause "model failed to load" errors

### Safe Writing Pattern (PowerShell)

```powershell
# CORRECT — UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)

# WRONG — these add BOM
Set-Content -Path $filePath -Value $content -Encoding UTF8  # Adds BOM!
Out-File -FilePath $filePath -Encoding UTF8                  # Adds BOM!
```

### BOM Detection and Fix

```powershell
# Detect BOM
$bytes = [System.IO.File]::ReadAllBytes($filePath)
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "BOM detected in $filePath"

    # Fix: re-write without BOM
    $content = [System.IO.File]::ReadAllText($filePath)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
}
```

## Validation Checklist

Before committing TMDL files, verify:

- [ ] UTF-8 encoding without BOM
- [ ] Tab indentation (no spaces)
- [ ] All names with special characters are single-quoted
- [ ] Descriptions use `///` (not `//`)
- [ ] Every column has `dataType` and `summarizeBy`
- [ ] Every measure has `formatString` for numeric results
- [ ] Relationships reference existing table and column names
- [ ] M expressions in partitions use correct indentation
- [ ] lineageTag GUIDs are unique (or omitted for new objects — PBI will generate)
- [ ] File validates in Power BI Desktop (open the .pbip project)
