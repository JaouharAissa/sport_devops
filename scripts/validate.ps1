param(
  [switch]$SkipDocker
)

$ErrorActionPreference = "Stop"

Write-Host "==> Installing dependencies"
npm --prefix backend ci
npm --prefix frontend ci

Write-Host "==> Backend lint + tests"
npm --prefix backend run lint
npm --prefix backend run test:ci

Write-Host "==> Frontend lint + tests + build"
npm --prefix frontend run lint
npm --prefix frontend run test:ci
npm --prefix frontend run build

if (-not $SkipDocker) {
  Write-Host "==> Docker Compose validation"
  docker compose config | Out-Null
}

Write-Host "Validation completed successfully."
