---
description: "Best practices for Power Query (M) expressions in Power BI: query folding, performance optimization, data transformation patterns, and error handling."
applyTo: "**/*.{m,pq,pbix,json,md,txt}"
---

# Power Query (M) Best Practices

## Query Folding

Query folding pushes transformations to the data source (SQL), reducing memory and improving refresh performance.

### Foldable Operations
✅ `Table.SelectRows` (WHERE)
✅ `Table.SelectColumns` (SELECT)
✅ `Table.Sort` (ORDER BY)
✅ `Table.Group` (GROUP BY)
✅ `Table.Join` (JOIN)
✅ `Table.Distinct` (DISTINCT)
✅ `Table.FirstN`, `Table.Skip` (TOP, OFFSET)
✅ `Table.TransformColumnTypes` (CAST)

### Non-Foldable Operations (Break Folding)
❌ `Table.AddColumn` with custom functions
❌ `Table.Pivot` / `Table.Unpivot` (in most sources)
❌ `Table.Buffer`
❌ `Table.Combine` (appending from different sources)
❌ `List.Generate`, `List.Accumulate`
❌ Custom M functions with non-foldable logic

### Verify Folding
```
Right-click any step → "View Native Query"
- If available: step folds to source ✅
- If grayed out: folding is broken from this step ❌
```

### Best Practice: Order Steps for Maximum Folding

```m
let
    // 1. Connect to source (foldable)
    Source = Sql.Database("server", "database"),
    Sales = Source{[Schema="dbo", Item="Sales"]}[Data],

    // 2. Filter rows FIRST (foldable — pushes WHERE to SQL)
    FilteredRows = Table.SelectRows(Sales, each [Year] >= 2024),

    // 3. Select columns EARLY (foldable — reduces data transfer)
    SelectedColumns = Table.SelectColumns(FilteredRows,
        {"OrderID", "CustomerID", "Amount", "OrderDate"}),

    // 4. Type transformations (foldable — CAST in SQL)
    TypedColumns = Table.TransformColumnTypes(SelectedColumns, {
        {"Amount", type number},
        {"OrderDate", type date}
    }),

    // 5. Non-foldable steps LAST (after maximum folding)
    AddedMonth = Table.AddColumn(TypedColumns, "OrderMonth",
        each Date.ToText([OrderDate], "yyyy-MM"), type text)
in
    AddedMonth
```

## Performance Optimization

### DO

✅ **Filter rows as early as possible** — reduce dataset before transformations
✅ **Remove unnecessary columns** — use `Table.SelectColumns` or `Table.RemoveColumns` early
✅ **Use `Table.Buffer` sparingly** — only when a table is referenced multiple times in the same query
✅ **Avoid `Table.RowCount` in filters** — it forces full table evaluation
✅ **Use native SQL queries** when complex folding is needed:

```m
let
    Source = Sql.Database("server", "database", [
        Query = "
            SELECT OrderID, CustomerID, Amount, OrderDate
            FROM dbo.Sales
            WHERE Year >= 2024
            AND Status = 'Completed'
        "
    ])
in
    Source
```

✅ **Use `Value.NativeQuery` for parameterized queries:**

```m
let
    Source = Sql.Database("server", "database"),
    Result = Value.NativeQuery(Source, "
        SELECT * FROM dbo.Sales WHERE Year >= @Year
    ", [Year = 2024])
in
    Result
```

### DON'T

❌ **Don't use `Table.Combine` for incremental patterns** — use incremental refresh instead
❌ **Don't create deeply nested `if/then/else`** — use `Table.AddColumn` with a helper function or `List.Contains`
❌ **Don't reference columns by position** — always use column names
❌ **Don't use `Table.TransformRows`** — it breaks column type metadata and prevents folding

## Data Type Best Practices

### Assign Types Early

```m
// DO: explicit type assignment
Table.TransformColumnTypes(Source, {
    {"CustomerKey", Int64.Type},
    {"CustomerName", type text},
    {"BirthDate", type date},
    {"IsActive", type logical},
    {"Revenue", type number}
})
```

### Avoid Implicit Type Detection

```m
// DON'T: auto-detect types (slow, unreliable for large datasets)
Table.TransformColumnTypes(Source, Table.Schema(Source))

// DO: explicitly define all types
```

### Date Handling

```m
// Split DateTime into Date + Time when only Date is needed
// (reduces model size — Date has lower cardinality than DateTime)
AddDate = Table.AddColumn(Source, "OrderDate",
    each DateTime.Date([OrderDateTime]), type date),
RemoveDateTime = Table.RemoveColumns(AddDate, {"OrderDateTime"})
```

## Error Handling

### Graceful Error Handling

```m
// Replace errors in a column with null
CleanedColumn = Table.ReplaceErrorValues(Source, {
    {"Amount", null},
    {"Date", null}
})
```

### Try/Otherwise Pattern

```m
// Safe parsing with fallback
SafeParse = Table.AddColumn(Source, "ParsedDate",
    each try Date.FromText([DateString]) otherwise null,
    type date)
```

### Error Logging

```m
// Keep errors for investigation
ErrorRows = Table.SelectRowsWithErrors(Source, {"Amount"}),
CleanRows = Table.RemoveRowsWithErrors(Source, {"Amount"})
```

## Parameterization

### Query Parameters

```m
// Define as separate query
StartDate = #date(2024, 1, 1) meta [
    IsParameterQuery = true,
    Type = "Date",
    IsParameterQueryRequired = true
]

// Use in filter (still foldable if source supports it)
FilteredSales = Table.SelectRows(Sales, each [OrderDate] >= StartDate)
```

### Environment-Based Configuration

```m
// Parameter for server/database (switch between Dev/Test/Prod)
ServerName = "prod-server.database.windows.net" meta [
    IsParameterQuery = true,
    Type = "Text",
    IsParameterQueryRequired = true
],

DatabaseName = "SalesDB" meta [
    IsParameterQuery = true,
    Type = "Text",
    IsParameterQueryRequired = true
],

Source = Sql.Database(ServerName, DatabaseName)
```

## Common Transformation Patterns

### Unpivot for Star Schema

```m
// Convert wide format to fact table format
Unpivoted = Table.UnpivotOtherColumns(Source,
    {"ProductID", "Region"},       // Keep these as-is
    "MonthYear", "SalesAmount")    // Unpivot all other columns
```

### Conditional Merge (Lookup)

```m
// Left join for dimension lookup
Merged = Table.NestedJoin(FactSales, {"CustomerID"},
    DimCustomer, {"CustomerID"},
    "CustomerDetails", JoinKind.LeftOuter),

Expanded = Table.ExpandTableColumn(Merged, "CustomerDetails",
    {"CustomerName", "Region"})
```

### Incremental Load Pattern

```m
// RangeStart and RangeEnd for incremental refresh
let
    Source = Sql.Database("server", "database"),
    Sales = Source{[Schema="dbo", Item="Sales"]}[Data],
    Filtered = Table.SelectRows(Sales,
        each [OrderDate] >= RangeStart and [OrderDate] < RangeEnd)
in
    Filtered
```

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Queries (tables) | PascalCase, match model table name | `DimCustomer`, `FactSales` |
| Staging queries | Prefix with `_stg` or `Staging` | `_stgRawSales`, `StagingCustomers` |
| Parameters | PascalCase descriptive | `ServerName`, `StartDate` |
| Functions | Prefix `fn` + PascalCase | `fnCleanText`, `fnParseDate` |
| Step names | PascalCase describing the action | `FilteredRows`, `RemovedDuplicates` |

## Validation Checklist

- [ ] Foldable operations placed before non-foldable steps
- [ ] "View Native Query" available on maximum number of steps
- [ ] Unnecessary columns removed early in the query
- [ ] All column types explicitly assigned
- [ ] DateTime split into Date when Time not needed
- [ ] Error handling implemented for external data sources
- [ ] Parameters used for server/database (not hard-coded)
- [ ] Staging queries disabled from load (not imported into model)
- [ ] Query names match target table names in the model
- [ ] No `Table.Buffer` unless justified for multiple references
