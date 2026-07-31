# Robust setup script: runs package manager install for backend and frontend
$ErrorActionPreference = 'Stop'

# Resolve script directory and run from it
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptDir) { $scriptDir = Get-Location }
Set-Location -Path $scriptDir

function Find-Tool($name) { Get-Command $name -ErrorAction SilentlyContinue }

$pkgManager = if (Find-Tool npm) { 'npm' } elseif (Find-Tool yarn) { 'yarn' } elseif (Find-Tool pnpm) { 'pnpm' } else { $null }

if (-not $pkgManager) {
	Write-Error "No package manager found (npm, yarn, or pnpm). Install Node.js/npm or yarn/pnpm and rerun this script."
	exit 1
}

Write-Host "Using package manager: $pkgManager" -ForegroundColor Green

$projects = @('backend','frontend')
foreach ($p in $projects) {
	$projPath = Join-Path $scriptDir $p
	if (-not (Test-Path $projPath)) {
		Write-Host "Skipping '$p': directory not found." -ForegroundColor Yellow
		continue
	}

	Set-Location -Path $projPath
	if (-not (Test-Path (Join-Path $projPath 'package.json'))) {
		Write-Host "Skipping '$p': package.json not found." -ForegroundColor Yellow
		Set-Location -Path $scriptDir
		continue
	}

	try {
		Write-Host "Installing dependencies for '$p'..." -ForegroundColor Cyan
		if ($pkgManager -eq 'npm') {
			if (Test-Path (Join-Path $projPath 'package-lock.json')) {
				npm ci
			} else {
				npm install
			}
		} elseif ($pkgManager -eq 'yarn') {
			yarn install
		} else {
			pnpm install
		}
		Write-Host "Installed dependencies for '$p' successfully." -ForegroundColor Green
	} catch {
		Write-Host "Failed to install dependencies for '$p': $_" -ForegroundColor Red
		Write-Host "You may need to run this script with a package manager available or run install manually." -ForegroundColor Yellow
	}

	Set-Location -Path $scriptDir
}

Write-Host "Setup complete." -ForegroundColor Green
