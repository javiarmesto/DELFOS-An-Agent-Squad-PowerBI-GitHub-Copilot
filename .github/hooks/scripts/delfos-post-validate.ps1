<#
.SYNOPSIS
  Post-tool validation for PBIR JSON and TMDL files.
  Called by .github/hooks/delfos-pbi-post-validation.json on PostToolUse.

.DESCRIPTION
  After a Write or Edit operation, validates the file integrity:
  - JSON files in PBIR directories: validates with ConvertFrom-Json
  - TMDL files: checks for BOM encoding and basic structural issues

  Exit codes:
    0 — validation passed or not applicable
    (stdout JSON with systemMessage if issues detected)
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
    exit 0
}

# --- 2. Extract tool metadata ---
$toolName  = $inputJson.toolName
$toolInput = $inputJson.toolInput
$filePath  = $null

switch ($toolName) {
    'replace_string_in_file' { $filePath = $toolInput.filePath }
    'create_file'            { $filePath = $toolInput.filePath }
    'write_file'             { $filePath = $toolInput.filePath }
    default                  { exit 0 }
}

if (-not $filePath -or -not (Test-Path $filePath)) {
    exit 0
}

# --- 3. Validate JSON files (PBIR, report.json, etc.) ---
if ($filePath -match '\.(json|pbir)$') {
    try {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $null = $content | ConvertFrom-Json -ErrorAction Stop
        # Valid JSON — pass silently
        exit 0
    }
    catch {
        $errorMsg = $_.Exception.Message
        $output = @{
            systemMessage = @"
WARNING: JSON validation failed for $filePath
Error: $errorMsg

The file may be corrupted. Please review and fix the JSON syntax.
Common issues: trailing commas, missing quotes, unescaped characters.
"@
        } | ConvertTo-Json -Compress
        Write-Output $output
        exit 0
    }
}

# --- 4. Validate TMDL files ---
if ($filePath -like '*.tmdl') {
    $issues = @()

    # Check for BOM
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $issues += "BOM detected — Power BI Desktop expects UTF-8 without BOM. File will cause errors."
    }

    # Check for tab vs space indentation
    $lines = Get-Content -Path $filePath -Encoding UTF8
    $spacedLines = $lines | Where-Object { $_ -match '^\s+ ' -and $_ -notmatch '^\t' } | Select-Object -First 3
    if ($spacedLines.Count -gt 0) {
        $issues += "Space indentation detected — TMDL requires tab indentation (semantic indentation)."
    }

    # Check for CRLF vs LF (TMDL uses CRLF on Windows)
    $rawContent = [System.IO.File]::ReadAllText($filePath)
    if ($rawContent -match "`r`n") {
        # CRLF is fine for Windows
    }

    if ($issues.Count -gt 0) {
        $issueList = ($issues | ForEach-Object { "  - $_" }) -join "`n"
        $output = @{
            systemMessage = @"
WARNING: TMDL validation issues in $filePath
$issueList

Recommended: use MCP tools or PowerShell with UTF8Encoding(`$false) for TMDL edits.
"@
        } | ConvertTo-Json -Compress
        Write-Output $output
        exit 0
    }

    exit 0
}

# --- 5. Not a file we validate — pass through ---
exit 0
