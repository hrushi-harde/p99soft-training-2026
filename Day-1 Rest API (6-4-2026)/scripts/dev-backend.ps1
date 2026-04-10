$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

$pythonCandidates = @(
  @{ Name = '.venv'; Path = (Join-Path -Path $repoRoot -ChildPath '.venv\Scripts\python.exe') }
  @{ Name = 'venv'; Path = (Join-Path -Path $repoRoot -ChildPath 'venv\Scripts\python.exe') }
)

$existingCandidates = $pythonCandidates | Where-Object { Test-Path $_.Path }
if (-not $existingCandidates -or $existingCandidates.Count -eq 0) {
  Write-Host 'No venv found. Create one and install requirements:'
  Write-Host '  python -m venv .venv'
  Write-Host '  .\.venv\Scripts\Activate.ps1'
  Write-Host '  pip install -r requirements.txt'
  exit 1
}

Set-Location $repoRoot

function Test-HasFastAPI([string]$py) {
  & $py -c "import importlib.util, sys; sys.exit(0 if importlib.util.find_spec('fastapi') else 1)" | Out-Null
  return ($LASTEXITCODE -eq 0)
}

# Prefer a venv that already has FastAPI installed (prevents .venv vs venv mismatch issues)
$pythonExe = $null
foreach ($candidate in $existingCandidates) {
  if (Test-HasFastAPI $candidate.Path) {
    $pythonExe = $candidate.Path
    break
  }
}

if (-not $pythonExe) {
  # None of the venvs have deps yet: try installing into the first one; if it fails, try the next.
  foreach ($candidate in $existingCandidates) {
    Write-Host ("Installing backend dependencies into {0}..." -f $candidate.Name)
    & $candidate.Path -m pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0 -and (Test-HasFastAPI $candidate.Path)) {
      $pythonExe = $candidate.Path
      break
    }
  }

  if (-not $pythonExe) {
    Write-Host 'Failed to install backend dependencies into any detected venv.'
    Write-Host 'Tip: Python 3.14 may not have wheels for some packages (e.g., pydantic-core) and can require Rust/Cargo.'
    Write-Host 'Use a supported Python (3.12/3.13) or install Rust toolchain, then re-create the venv.'
    exit 1
  }
}

& $pythonExe -m uvicorn app.main:app --reload --port 8000
