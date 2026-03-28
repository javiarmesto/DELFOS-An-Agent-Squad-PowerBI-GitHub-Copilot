<#
.SYNOPSIS
  Pre-flight gate for TMDL file edits.
  Called by .github/hooks/delfos-pbi-preflight-check.json on PreToolUse.

.DESCRIPTION
  Reads the hook JSON from stdin, checks whether the tool targets a .tmdl file,
  and verifies that Power BI Desktop is running before allowing the edit.

  Exit codes:
    0 — hook processed successfully (decision in stdout JSON)
    2 — blocking error
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

# --- 1. Read hook input from stdin ---
$inputJson = $null
try {
    $inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
}
catch {
    # Cannot parse input — allow to avoid blocking unrelated tools
    exit 0
}

# --- 2. Extract tool metadata ---
$toolName  = $inputJson.toolName
$toolInput = $inputJson.toolInput

# --- 3. Determine if the operation targets a .tmdl file ---
$targetsTmdl = $false

switch ($toolName) {
    'replace_string_in_file' {
        if ($toolInput.filePath -and $toolInput.filePath -like '*.tmdl') {
            $targetsTmdl = $true
        }
    }
    'create_file' {
        if ($toolInput.filePath -and $toolInput.filePath -like '*.tmdl') {
            $targetsTmdl = $true
        }
    }
    'multi_replace_string_in_file' {
        if ($toolInput.replacements) {
            foreach ($r in $toolInput.replacements) {
                if ($r.filePath -and $r.filePath -like '*.tmdl') {
                    $targetsTmdl = $true
                    break
                }
            }
        }
    }
    default {
        # Not a file-editing tool we care about — pass through
        exit 0
    }
}

if (-not $targetsTmdl) {
    # Tool targets a non-TMDL file — allow silently
    exit 0
}

# --- 4. Check if Power BI Desktop is running ---
$pbiProcess = Get-Process -Name 'PBIDesktop' -ErrorAction SilentlyContinue

if ($pbiProcess) {
    # PBI Desktop is running — allow but inject MCP reminder
    $output = @{
        systemMessage = @"
Power BI Desktop is running. Use MCP tools (mcp_powerbi-model_*) instead of direct TMDL edits:
1. Connect via mcp_powerbi-model_connection_operations
2. Modify model via MCP table/column/measure/relationship operations
3. Export clean TMDL via mcp_powerbi-model_database_operations -> ExportToTmdlFolder
Direct file writes cause BOM encoding errors that break the .pbip project.
"@
    } | ConvertTo-Json -Compress
    Write-Output $output
    exit 0
}
else {
    # PBI Desktop is NOT running — require user confirmation
    $output = @{
        hookSpecificOutput = @{
            hookEventName           = 'PreToolUse'
            permissionDecision      = 'ask'
            permissionDecisionReason = @"
Power BI Desktop is NOT running. Direct TMDL edits are risky:
- create_file / replace_string_in_file write UTF-8 with BOM (breaks PBI Desktop)
- M syntax errors are not validated until the file is opened
Recommended: open the .pbip in Power BI Desktop and use MCP tools instead.
If you proceed, use PowerShell with UTF8Encoding(`$false) and run fix-tmdl.ps1 afterward.
"@
        }
    } | ConvertTo-Json -Depth 3 -Compress
    Write-Output $output
    exit 0
}
