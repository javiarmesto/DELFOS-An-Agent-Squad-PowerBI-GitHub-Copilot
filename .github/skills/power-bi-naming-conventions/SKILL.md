---
name: power-bi-naming-conventions
description: >
  Audit and standardize naming conventions across Power BI semantic models.
  Covers tables, columns, measures, relationships, roles, and display folders.
  USE WHEN: "standardize names", "naming convention audit", "rename tables consistently",
  "measure naming best practices", "column naming standards", "display folder structure",
  "inconsistent names in model", "clean up model names", "naming guidelines Power BI",
  "table name singular or plural", "measure prefix convention".
  RELATED SKILLS: power-bi-model-design-review, power-bi-lineage-analysis, power-bi-tmdl-authoring.
---

# Power BI Naming Conventions — Audit & Standardization

You are a Power BI naming convention expert. Your role is to audit semantic models for naming consistency and apply standardized conventions that improve readability, maintainability, and discoverability.

## Naming Convention Standards

### Tables

| Convention | Pattern | Example |
|-----------|---------|---------|
| Dimension tables | `Dim` prefix + PascalCase singular | `DimCustomer`, `DimProduct`, `DimDate` |
| Fact tables | `Fact` prefix + PascalCase singular | `FactSales`, `FactInventory` |
| Bridge tables | `Bridge` prefix + PascalCase | `BridgeCustomerProduct` |
| Security tables | `Security` prefix + PascalCase | `SecurityUserRole` |
| Calculation groups | PascalCase descriptive | `TimeIntelligence`, `CurrencyConversion` |
| Parameter tables | PascalCase descriptive | `TopNSelection`, `DateRange` |
| Measure tables | `_Measures` or `_KPIs` prefix | `_Measures`, `_KPIs` (hidden container) |

**Rules:**
- Use **singular nouns** for tables (`DimCustomer`, not `DimCustomers`)
- Avoid spaces in table names when possible (use PascalCase)
- If spaces are required for business clarity, use them consistently: `'Sales Order'`
- The `_` prefix for measure-only tables pushes them to the top of the field list

### Columns

| Convention | Pattern | Example |
|-----------|---------|---------|
| Key columns | `{TableEntity}Key` | `CustomerKey`, `ProductKey`, `DateKey` |
| Name/description | Descriptive PascalCase | `CustomerName`, `ProductCategory` |
| Flag/boolean | `Is` prefix | `IsActive`, `IsCurrentYear`, `HasDiscount` |
| Date columns | Descriptive + context | `OrderDate`, `ShipDate`, `DueDate` |
| Amount columns | Descriptive + `Amount` | `SalesAmount`, `CostAmount`, `TaxAmount` |
| Count columns | Descriptive + `Count` | `LineItemCount`, `OrderCount` |
| Code columns | Descriptive + `Code` | `CurrencyCode`, `CountryCode` |
| ID columns (natural) | Descriptive + `ID` | `OrderID`, `InvoiceID` |

**Rules:**
- Use **PascalCase** (no underscores, no spaces unless business-required)
- Always use `Key` suffix for surrogate keys (relationships), `ID` for natural/business keys
- Fully qualify meaning: `CustomerName` not just `Name`
- Avoid abbreviations unless universally understood (`Qty` → `Quantity`)

### Measures

| Convention | Pattern | Example |
|-----------|---------|---------|
| Base aggregations | Descriptive verb + noun | `Total Sales`, `Total Cost`, `Order Count` |
| Ratios/percentages | Descriptive + `%` or `Ratio` | `Gross Margin %`, `Conversion Ratio` |
| Comparisons | Period + `vs` + Period | `Sales YoY %`, `Budget vs Actual` |
| Time intelligence | Metric + Time function | `Sales YTD`, `Sales MTD`, `Sales PY` |
| Rankings | Metric + `Rank` | `Sales Rank`, `Customer Rank` |
| Running totals | `Running` + Metric | `Running Total Sales` |
| Targets/goals | Metric + `Target` | `Sales Target`, `Revenue Goal` |

**Rules:**
- Use **spaces for readability** in measure names (they appear in reports)
- Start with the metric context: `Total Sales`, not `Sales Total`
- Use consistent time abbreviations: `YTD`, `MTD`, `QTD`, `PY`, `PM`, `YoY`
- Organize in **display folders** by business domain

### Display Folders

Organize measures into logical groups:

```
Revenue/
├── Total Sales
├── Sales YTD
├── Sales PY
└── Sales YoY %

Costs/
├── Total Cost
├── COGS
└── Gross Margin %

Customers/
├── Customer Count
├── New Customers
└── Customer Retention %

Targets/
├── Sales Target
├── Budget Amount
└── Budget vs Actual %
```

### Relationships

No explicit naming in TMDL unless using named relationships:

```tmdl
// Implicit (table + column names make it clear)
relationship
	fromColumn: FactSales.DateKey
	toColumn: DimDate.DateKey

// For inactive relationships, add context
relationship rel_FactSales_ShipDate
	fromColumn: FactSales.ShipDateKey
	toColumn: DimDate.DateKey
	isActive: false
```

### Roles (RLS)

| Convention | Pattern | Example |
|-----------|---------|---------|
| Territory-based | `RLS_{Scope}` | `RLS_Territory`, `RLS_Region` |
| Department-based | `RLS_{Department}` | `RLS_Finance`, `RLS_Sales` |
| Manager hierarchy | `RLS_{Level}` | `RLS_Manager`, `RLS_Director` |
| Test roles | `Test_{Scope}` | `Test_AllData`, `Test_Europe` |

## Audit Process

### Step 1: Inventory Collection

Collect all named objects via MCP or file scan:

```dax
// Tables
EVALUATE SELECTCOLUMNS(INFO.TABLES(), "Name", [Name])

// Columns per table
EVALUATE SELECTCOLUMNS(INFO.COLUMNS(), "Table", [TableName], "Column", [Name])

// Measures
EVALUATE SELECTCOLUMNS(INFO.MEASURES(), "Table", [TableName], "Measure", [Name], "Folder", [DisplayFolder])

// Relationships
EVALUATE INFO.RELATIONSHIPS()
```

### Step 2: Pattern Detection

For each object, classify its current naming pattern:

| Pattern | Examples | Status |
|---------|----------|--------|
| PascalCase | `CustomerName`, `DimDate` | Preferred |
| camelCase | `customerName`, `dimDate` | Non-standard |
| snake_case | `customer_name`, `dim_date` | Non-standard |
| UPPER_CASE | `CUSTOMER_NAME` | Non-standard |
| Spaces | `Customer Name`, `Dim Date` | OK for measures |
| Mixed | Various patterns in same model | Inconsistent |

### Step 3: Violation Detection

Check for these common violations:

```
Critical Violations:
□ Fact tables without "Fact" prefix
□ Dimension tables without "Dim" prefix
□ Key columns without "Key" suffix
□ Boolean columns without "Is" prefix
□ Measures with abbreviated unclear names
□ Inconsistent casing across same type of object

Moderate Violations:
□ Spaces in table names (OK but inconsistent if mixed)
□ Missing display folders for measures
□ Generic names ("Value", "Name", "ID" without context)
□ Abbreviations not universally understood
□ Plural table names mixed with singular

Minor Violations:
□ Inconsistent use of "Amount" vs "Value" suffixes
□ Missing descriptions on key business measures
□ Display folder depth >2 levels
```

### Step 4: Generate Rename Plan

```
📋 Naming Convention Audit Report
══════════════════════════════════

📊 Summary
   Tables:       {N} total ({N} compliant, {N} violations)
   Columns:      {N} total ({N} compliant, {N} violations)
   Measures:     {N} total ({N} compliant, {N} violations)
   Consistency:  {X}%

🔴 Critical Violations (rename required)
   | Object | Current Name | Proposed Name | Type |
   |--------|-------------|---------------|------|
   | Table  | Sales       | FactSales     | Missing prefix |
   | Column | CustID      | CustomerKey   | Unclear + wrong suffix |

🟡 Moderate Violations (rename recommended)
   | Object | Current Name | Proposed Name | Reason |
   |--------|-------------|---------------|--------|
   | Measure| Rev         | Total Revenue | Abbreviation |

🟢 Compliant Objects
   {count and summary of correctly named objects}

📋 Rename Execution Plan
   1. Run lineage analysis on each object to be renamed
   2. Update TMDL files (table declaration, column/measure names)
   3. Update relationships.tmdl for key column renames
   4. Update roles/*.tmdl for RLS-referenced column renames
   5. Update visual.json queryRef and Entity/Property for report bindings
   6. Search for orphaned old names: grep -r "OldName" --include="*.tmdl" --include="*.json"
   7. Open in Power BI Desktop and validate all visuals
```

## Validation Checklist

- [ ] All tables follow prefix convention (Dim/Fact/Bridge/Security)
- [ ] All tables use singular nouns
- [ ] All key columns end with `Key`
- [ ] All boolean columns start with `Is`
- [ ] All measures have readable names with spaces
- [ ] All measures organized in display folders
- [ ] Consistent casing across all object types
- [ ] No ambiguous or generic names remain
- [ ] Lineage analysis completed before executing renames
- [ ] All renames validated in Power BI Desktop
