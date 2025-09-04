# Auto-commit watcher for Windows PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File ./scripts/auto-commit.ps1

$ErrorActionPreference = 'SilentlyContinue'

# Determine repo root (parent of scripts directory)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir

Write-Host "[auto-commit] Watching for changes in: $RepoRoot" -ForegroundColor Green

# Change to repo root
Set-Location $RepoRoot

# Initialize FileSystemWatcher
$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $RepoRoot
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true
# Watch relevant file types; you can adjust as needed
$fsw.Filter = '*.*'

# Debounce settings
$debounceMs = 2000
$lastAction = Get-Date
$pending = $false

# Helper to determine if path should be ignored
function Should-IgnorePath($path) {
  $lower = $path.ToLower()
  if ($lower -match '\\node_modules\\' -or $lower -match '\\build\\' -or $lower -match '\\.git\\') { return $true }
  return $false
}

# Register events
$handlers = @()
$handlers += Register-ObjectEvent $fsw Changed -SourceIdentifier FSChange -Action {
  if (-not (Should-IgnorePath($Event.SourceEventArgs.FullPath))) { $global:pending = $true; $global:lastAction = Get-Date }
}
$handlers += Register-ObjectEvent $fsw Created -SourceIdentifier FSChange -Action {
  if (-not (Should-IgnorePath($Event.SourceEventArgs.FullPath))) { $global:pending = $true; $global:lastAction = Get-Date }
}
$handlers += Register-ObjectEvent $fsw Renamed -SourceIdentifier FSChange -Action {
  if (-not (Should-IgnorePath($Event.SourceEventArgs.FullPath))) { $global:pending = $true; $global:lastAction = Get-Date }
}
$handlers += Register-ObjectEvent $fsw Deleted -SourceIdentifier FSChange -Action {
  if (-not (Should-IgnorePath($Event.SourceEventArgs.FullPath))) { $global:pending = $true; $global:lastAction = Get-Date }
}

Write-Host "[auto-commit] Auto-commit running. Press Ctrl+C to stop." -ForegroundColor Yellow

try {
  while ($true) {
    Start-Sleep -Milliseconds 500
    if ($pending -and ((Get-Date) - $lastAction).TotalMilliseconds -ge $debounceMs) {
      $pending = $false
      # Stage changes
      git add -A | Out-Null
      # Create commit with timestamp
      $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
      $msg = "Auto-commit: $ts"
      # Only commit if there are staged changes
      $status = git status --porcelain
      if (-not [string]::IsNullOrWhiteSpace($status)) {
        try {
          git commit -m $msg | Out-Null
          Write-Host "[auto-commit] $msg" -ForegroundColor Cyan
        } catch {
          Write-Host "[auto-commit] Nothing to commit or commit failed." -ForegroundColor DarkGray
        }
      }
    }
  }
}
finally {
  foreach ($h in $handlers) { Unregister-Event -SourceIdentifier $h.Name -ErrorAction SilentlyContinue }
  $fsw.EnableRaisingEvents = $false
  $fsw.Dispose()
}
