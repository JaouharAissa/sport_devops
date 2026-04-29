#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing dependencies"
npm --prefix backend ci
npm --prefix frontend ci

echo "==> Backend lint + tests"
npm --prefix backend run lint
npm --prefix backend run test:ci

echo "==> Frontend lint + tests + build"
npm --prefix frontend run lint
npm --prefix frontend run test:ci
npm --prefix frontend run build

echo "==> Docker Compose validation"
docker compose config >/dev/null

echo "Validation completed successfully."
