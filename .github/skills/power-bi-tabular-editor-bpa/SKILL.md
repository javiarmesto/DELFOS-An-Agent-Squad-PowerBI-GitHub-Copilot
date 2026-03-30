---
name: power-bi-tabular-editor-bpa
description: >
  Best Practice Analyzer (BPA) rules for Tabular Editor. Create, debug, improve,
  and audit BPA rules using Dynamic LINQ expressions for Power BI semantic models.
  USE WHEN: "create BPA rule", "best practice analyzer", "Tabular Editor rule",
  "BPA expression", "Dynamic LINQ", "audit model with BPA", "suggest BPA rule",
  "fix BPA expression", "model validation rules", "enforce naming convention via BPA",
  "BPA severity levels", "TE best practice rules".
  RELATED SKILLS: power-bi-naming-conventions, power-bi-model-design-review, power-bi-tmdl-authoring.
---

# Tabular Editor BPA Rules — Best Practice Analyzer

You are an expert in creating and debugging Best Practice Analyzer (BPA) rules for Tabular Editor. BPA rules automate quality checks on Power BI semantic models using Dynamic LINQ expressions.

## What Are BPA Rules?

BPA rules are JSON-defined quality gates that run against a Tabular Object Model (TOM). Each rule:
- Targets specific object types (measures, columns, tables, relationships)
- Evaluates a Dynamic LINQ expression against each object
- Reports violations with configurable severity
- Can optionally auto-fix issues via FixExpression

## Rule JSON Structure

```json
{
  "ID": "CATEGORY_DESCRIPTIVE_NAME",
  "Name": "Human-readable rule name",
  "Category": "Category Name",
  "Description": "Why this rule matters and how to fix violations.",
  "Severity": 2,
  "Scope": "Measure",
  "Expression": "Dynamic LINQ expression returning true for violations",
  "FixExpression": null,
  "CompatibilityLevel": 1200
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Unique identifier. Convention: `PREFIX_DESCRIPTIVE_NAME` |
| `Name` | string | Display name in BPA results |
| `Category` | string | Grouping label (`DAX Expressions`, `Formatting`, `Naming Conventions`, `Performance`, `Error Prevention`, `Maintenance`) |
| `Description` | string | Explanation + fix guidance |
| `Severity` | int | `1` = Information, `2` = Warning, `3` = Error |
| `Scope` | string | Comma-separated object types to check |
| `Expression` | string | Dynamic LINQ — returns `true` for violations |
| `FixExpression` | string | Optional auto-fix (use only for safe, deterministic fixes) |
| `CompatibilityLevel` | int | Minimum compat level (`1200` = SQL Server 2016+, `1500` = Power BI) |

### Valid Scope Values

| Scope | Object Type | Common Properties |
|-------|------------|-------------------|
| `Model` | Entire model | `Tables`, `Relationships`, `Cultures` |
| `Table` | Table | `Name`, `Columns`, `Measures`, `IsHidden`, `Partitions` |
| `Measure` | Measure | `Name`, `Expression`, `DisplayFolder`, `FormatString`, `IsHidden`, `Description` |
| `Column` | Column | `Name`, `DataType`, `IsHidden`, `SortByColumn`, `DisplayFolder`, `Description` |
| `CalculatedColumn` | Calculated column | Same as Column + `Expression` |
| `Hierarchy` | Hierarchy | `Name`, `Levels`, `IsHidden` |
| `Level` | Hierarchy level | `Name`, `Column` |
| `Partition` | Table partition | `Name`, `Expression`, `SourceType` |
| `Relationship` | Relationship | `FromTable`, `ToTable`, `FromColumn`, `ToColumn`, `CrossFilteringBehavior`, `IsActive` |
| `KPI` | KPI | `TargetExpression`, `StatusExpression` |
| `CalculationItem` | Calc group item | `Name`, `Expression`, `Ordinal` |

## Dynamic LINQ Expression Syntax

### Basic Patterns

```csharp
// String contains
Expression.Contains("FILTER(ALL(")

// String starts with
Name.StartsWith("Dim")

// String matching with case-insensitive
Name.ToUpper() == Name.ToUpper()

// Numeric comparison
Columns.Count > 50

// Boolean check
IsHidden == false

// Null/empty check
string.IsNullOrWhitespace(Description)

// Regex matching
System.Text.RegularExpressions.Regex.IsMatch(Name, "^[a-z]")
```

### Property Navigation

```csharp
// Access parent table from a measure
Table.Name

// Access columns of a table
Columns.Any(IsHidden == false)

// Count measures in a table
Measures.Count()

// Check relationships
UsedInRelationships.Any()

// Tokenize DAX expression (Tabular Editor feature)
Tokenize().Any(Type == DIV)
```

### Common Expression Patterns

```csharp
// Measure has no format string
string.IsNullOrWhitespace(FormatString)

// Column not hidden but is a foreign key used in relationship
UsedInRelationships.Any(FromColumn == outerIt) && !IsHidden

// Measure contains division without DIVIDE
Expression.Contains("/") && !Expression.Contains("DIVIDE(") && !Expression.Contains("//")

// Table has no description
string.IsNullOrWhitespace(Description) && !IsHidden

// Measure not in a display folder
string.IsNullOrWhitespace(DisplayFolder) && !IsHidden

// Column uses non-optimal data type for keys
DataType.ToString() == "String" && Name.EndsWith("Key")

// Bidirectional relationship
CrossFilteringBehavior.ToString() == "BothDirections"
```

## Standard Rule Collection

### DAX Quality Rules

```json
[
  {
    "ID": "DAX_NO_DIVIDE_FUNCTION",
    "Name": "Use DIVIDE instead of /",
    "Category": "DAX Expressions",
    "Description": "Division using / can cause errors when denominator is zero. Use DIVIDE(numerator, denominator, alternateResult) instead.",
    "Severity": 2,
    "Scope": "Measure, CalculatedColumn",
    "Expression": "Expression.Contains(\"/\") && !Expression.Contains(\"DIVIDE(\") && !Expression.Contains(\"//\") && !Expression.Contains(\"http\")",
    "CompatibilityLevel": 1200
  },
  {
    "ID": "DAX_NO_IFERROR",
    "Name": "Avoid IFERROR — use specific error handling",
    "Category": "DAX Expressions",
    "Description": "IFERROR masks all errors, making debugging difficult. Handle specific error conditions instead.",
    "Severity": 2,
    "Scope": "Measure, CalculatedColumn",
    "Expression": "Expression.ToUpper().Contains(\"IFERROR\")",
    "CompatibilityLevel": 1200
  },
  {
    "ID": "DAX_UNQUALIFIED_COLUMN",
    "Name": "Column references should be fully qualified",
    "Category": "DAX Expressions",
    "Description": "Always use Table[Column] syntax for column references. Unqualified [Column] may resolve ambiguously.",
    "Severity": 1,
    "Scope": "Measure",
    "Expression": "Tokenize().Any(Type == COLUMN_REF && Text.StartsWith(\"[\"))",
    "CompatibilityLevel": 1200
  }
]
```

### Naming Convention Rules

```json
[
  {
    "ID": "NAMING_MEASURE_NO_DESCRIPTION",
    "Name": "Visible measures should have descriptions",
    "Category": "Naming Conventions",
    "Description": "Add a Description to all visible measures to improve model documentation and AI/Copilot readiness.",
    "Severity": 1,
    "Scope": "Measure",
    "Expression": "string.IsNullOrWhitespace(Description) && !IsHidden",
    "CompatibilityLevel": 1200
  },
  {
    "ID": "NAMING_NO_DISPLAY_FOLDER",
    "Name": "Visible measures should be in display folders",
    "Category": "Naming Conventions",
    "Description": "Organize measures into display folders for better discoverability in the field list.",
    "Severity": 1,
    "Scope": "Measure",
    "Expression": "string.IsNullOrWhitespace(DisplayFolder) && !IsHidden",
    "CompatibilityLevel": 1200
  },
  {
    "ID": "NAMING_FK_NOT_HIDDEN",
    "Name": "Foreign key columns should be hidden",
    "Category": "Naming Conventions",
    "Description": "Columns used as foreign keys in relationships should be hidden from the report view to avoid confusion.",
    "Severity": 2,
    "Scope": "Column",
    "Expression": "UsedInRelationships.Any(FromColumn == outerIt) && !IsHidden",
    "FixExpression": "IsHidden = true",
    "CompatibilityLevel": 1200
  }
]
```

### Performance Rules

```json
[
  {
    "ID": "PERF_BIDIRECTIONAL_RELATIONSHIP",
    "Name": "Avoid bidirectional cross-filtering",
    "Category": "Performance",
    "Description": "Bidirectional relationships increase query complexity and can produce unexpected results. Use single-direction unless specifically required for many-to-many patterns.",
    "Severity": 2,
    "Scope": "Relationship",
    "Expression": "CrossFilteringBehavior.ToString() == \"BothDirections\"",
    "CompatibilityLevel": 1200
  },
  {
    "ID": "PERF_HIGH_CARDINALITY_COLUMN",
    "Name": "Text columns with high cardinality impact memory",
    "Category": "Performance",
    "Description": "Text columns with very high cardinality consume significant memory. Consider removing if unused, or hash if needed only for relationships.",
    "Severity": 1,
    "Scope": "Column",
    "Expression": "DataType.ToString() == \"String\" && Table.RowCount > 100000 && !IsHidden && !UsedInRelationships.Any()",
    "CompatibilityLevel": 1500
  },
  {
    "ID": "PERF_CALCULATED_COLUMN_IN_FACT",
    "Name": "Avoid calculated columns in fact tables",
    "Category": "Performance",
    "Description": "Calculated columns in fact tables consume memory and slow refresh. Move the logic to Power Query or use measures instead.",
    "Severity": 2,
    "Scope": "CalculatedColumn",
    "Expression": "Table.Name.StartsWith(\"Fact\") || Table.Measures.Count > 5",
    "CompatibilityLevel": 1200
  }
]
```

## Running BPA Rules

### Tabular Editor 2 CLI

```bash
# Run BPA against a model
TabularEditor.exe model.bim -A rules.json -O results.txt

# Run BPA against a PBIP model
TabularEditor.exe "MyModel.SemanticModel/model.tmdl" -A rules.json -O results.txt
```

### Tabular Editor 3 (GUI)

1. Open model in TE3
2. **Tools → Manage BPA Rules** → Import rules JSON
3. **Tools → Best Practice Analyzer** → Run analysis
4. Review and fix violations

### PowerShell Audit Script

```powershell
# Load rules file
$rules = Get-Content -Path "bpa-rules.json" | ConvertFrom-Json

# Summary
Write-Host "Loaded $($rules.Count) BPA rules"
$rules | Group-Object Category | ForEach-Object {
    Write-Host "  $($_.Name): $($_.Count) rules"
}
```

## Creating Custom Rules — Workflow

1. **Identify the pattern** — what bad practice should be caught?
2. **Determine scope** — which object types are affected?
3. **Write the expression** — Dynamic LINQ returning `true` for violations
4. **Test the expression** — run against a model with known violations
5. **Set severity** — 1 (info), 2 (warning), 3 (error)
6. **Write description** — explain why it matters and how to fix
7. **Consider FixExpression** — only for safe, deterministic auto-fixes
8. **Add to collection** — merge into the team's shared BPA rules file

## Validation Checklist

- [ ] Rule ID follows `PREFIX_DESCRIPTIVE_NAME` convention
- [ ] Expression uses valid Dynamic LINQ syntax
- [ ] Scope includes all applicable object types
- [ ] Severity matches the actual risk level
- [ ] Description explains both the problem and the fix
- [ ] FixExpression (if any) is safe and reversible
- [ ] Rule tested against a model with known violations
- [ ] No duplicate of existing standard rules
