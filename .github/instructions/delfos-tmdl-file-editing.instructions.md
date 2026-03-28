---
description: >
  CRITICAL rules for editing TMDL files in Power BI PBIP projects.
  MUST be read before creating or modifying any .tmdl file.
applyTo: "**/*.tmdl"
---

# TMDL File Editing Rules

## Pre-flight Check (MANDATORY)

Before ANY operation on .tmdl files or the semantic model, run the pre-flight check:
→ Invoke `#delfos-pbi-preflight-check` or manually execute:

1. `mcp_powerbi-model_connection_operations` → `ListLocalInstances` — detect PBI Desktop
2. `mcp_powerbi-model_connection_operations` → `ListConnections` — check active MCP connection

**If PBI Desktop is running → MUST connect via MCP before editing.**
**If PBI Desktop is NOT running → warn user and recommend opening it first.**

## PREFERRED: Use MCP Power BI Model Tools

When Power BI Desktop is open, **always prefer the MCP tools** over direct TMDL editing:

1. Connect via `mcp_powerbi-model_connection_operations` → `Connect`
2. Build model using:
   - `mcp_powerbi-model_table_operations` — create/modify tables
   - `mcp_powerbi-model_column_operations` — add/modify columns
   - `mcp_powerbi-model_measure_operations` — create DAX measures
   - `mcp_powerbi-model_relationship_operations` — define relationships
   - `mcp_powerbi-model_partition_operations` — configure partitions/M expressions
3. Export clean TMDL via `mcp_powerbi-model_database_operations` → `ExportToTmdlFolder`
4. Commit exported TMDL to git

**Why MCP is better:**
- Zero risk of BOM encoding issues
- M expressions validated in real-time by the engine
- No tab/space indentation problems
- Immediate feedback on syntax errors

Only fall back to direct TMDL editing when PBI Desktop is NOT available.

---

## Fallback: Direct TMDL editing

### NEVER use create_file or replace_string_in_file for .tmdl files

These tools write UTF-8 with BOM, which Power BI Desktop rejects with:
> "Only text with UTF8 encoding without BOM (byte order marks) is supported"

**Always use PowerShell** to write TMDL files:

```powershell
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
```

## Encoding and formatting

| Rule | Requirement |
|------|-------------|
| Encoding | UTF-8 **without BOM** |
| Indentation | **Tabs only**, never spaces |
| Line endings | CRLF (`\r\n`) on Windows |
| Newline at EOF | Yes, single trailing newline |

## M expressions in partition sources

Use simple column-name lists. **Never** use typed table definitions:

```
// ✅ CORRECT — column names as strings
#table({"EntryNo", "PostingDate", "Amount"}, {})

// ❌ WRONG — causes "Se esperaba el token Literal"
#table(type table [EntryNo = Int64.Type, PostingDate = date, Amount = number], {})
```

The M types `Int64.Type`, `logical`, `datetime`, `date` etc. are library types that
are NOT available during the Mashup Preview parse phase of PBI Desktop.

## Required elements per table TMDL

- Unique `lineageTag` GUID for the table
- Unique `lineageTag` GUID for each column
- `sourceColumn` matching the M expression column name
- `summarizeBy: none` for non-numeric columns
- Partition with `mode: import` and `source` block

## Verification after any TMDL edit

Run this PowerShell block to validate all TMDL files:

```powershell
$errors = @()
Get-ChildItem -Path . -Filter *.tmdl -Recurse | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $name = $_.Name

    # Check BOM
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $errors += "$name : has UTF-8 BOM"
    }
    # Check empty
    if ($bytes.Length -eq 0) {
        $errors += "$name : empty file"
    }
    # Check space indentation
    $text = [System.IO.File]::ReadAllText($_.FullName)
    if ($text -match '(?m)^ ') {
        $errors += "$name : uses space indentation (must be tabs)"
    }
}
if ($errors) { $errors | ForEach-Object { Write-Warning $_ } }
else { Write-Host "All TMDL files OK" -ForegroundColor Green }
```

## Error → Root cause reference

| PBI Desktop error | Root cause | Fix |
|---|---|---|
| "Se esperaba el token Literal" | `type table [col = Type]` in M expression | Use `#table({"col"}, {})` |
| "Detected BOM: UTF-8" | File has BOM bytes EF BB BF | Rewrite with `UTF8Encoding($false)` |
| Path encoding (é → Ã¡) | Hardcoded path with special chars | Use `$PSScriptRoot` or `Join-Path` |

## Safety net: fix-tmdl.ps1

Every PBIP repo should include a `fix-tmdl.ps1` script that can regenerate all TMDL
files from scratch. This script should:
1. Use `$PSScriptRoot` for paths (never hardcode paths with special characters)
2. Write all files with `UTF8Encoding($false)`
3. Validate BOM, encoding, and indentation after writing
4. Report per-file status
