# Fitness MERN App — DevOps Ready

Monorepo **MERN** (MongoDB + Express/Node + React) préparé pour une chaîne DevOps complète:
**Docker**, **Kubernetes**, **GitHub Actions**, **ArgoCD**, **Prometheus**, **Grafana**.

## Architecture

- **Backend**: Node.js/Express (`backend/`)  
  - API: `/users`, `/produits`, `/admin`
  - Health: `/health`
  - Metrics (Prometheus): `/metrics`
  - Uploads: `/uploads/*`
- **Frontend**: React (CRA) servi par **Nginx** (`frontend/`)  
  - SPA fallback + reverse proxy Nginx vers le backend
- **MongoDB**: container/Pod `mongodb`

## Variables d’environnement (cohérentes partout)

Backend:
- **PORT**: `5000`
- **MONGO_URL**: ex. `mongodb://mongodb:27017/mern_db` (K8s) ou `mongodb://admin:...@mongodb:27017/mern_db?authSource=admin` (docker-compose)
- **JWT_SECRET**: secret JWT (ne pas commiter une vraie valeur)
- **TOKEN_EXPIRE**: durée (secondes), ex. `2592000`

Frontend:
- **BACKEND_UPSTREAM** (Nginx): `backend:5000` (docker-compose) ou `backend-service:5000` (K8s)
- **REACT_APP_API_URL** (optionnel, build-time CRA): si tu veux forcer une baseURL côté navigateur

## Run en local (sans Docker)

### Prérequis
- Node.js 18+
- MongoDB local

### Backend

```powershell
cd backend
npm ci
$env:PORT="5000"
$env:MONGO_URL="mongodb://localhost:27017/Bases"
$env:JWT_SECRET="dev-secret"
node .\server.js
```

### Frontend

```powershell
cd frontend
npm ci
npm start
```

## Run avec Docker Compose (Windows)

```powershell
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/health`
- Metrics: `http://localhost:5000/metrics`

## Kubernetes (Minikube / Ubuntu)

### Appliquer les manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/jwt-secret.secret.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Notes importantes
- Les manifests MongoDB utilisent `emptyDir` (non persistant). Pour un vrai environnement, remplace par un **PVC**.
- L’ingress cible `fitness.local`. Ajoute une entrée DNS/hosts vers l’IP du contrôleur ingress (ex: Minikube).

## CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`
- lint + tests + build (backend/frontend)
- scan sécurité dépendances (`npm audit`)
- scan sécurité code/filesystem (`Trivy fs`)
- analyse qualité **SonarQube**
- build + scan images Docker (Trivy image)
- push images vers GHCR

### Secrets GitHub requis
- `SONAR_TOKEN`
- `SONAR_HOST_URL`

Le pipeline est configuré pour **échouer** en cas d'erreurs qualité/sécurité critique.

## CD GitOps (ArgoCD)

Workflow: `.github/workflows/cd.yml`
- déclenché automatiquement après CI réussie sur `main`
- met à jour les tags d'images dans `k8s/*.yaml` avec le commit SHA
- commit + push automatique des manifests
- ArgoCD synchronise automatiquement le cluster

Application ArgoCD:
- `k8s/argocd-application.yaml`
- sync policy: `automated + prune + selfHeal`

## Observability

- **/metrics** expose les métriques Node + histogramme HTTP (`fitness_http_request_duration_seconds`)
- `k8s/servicemonitor-backend.yaml` pour Prometheus Operator
- `k8s/prometheus-rule.yaml` pour alerting simple (backend down)

## DevSecOps

- SonarQube (qualité obligatoire)
- scans dépendances (`npm audit`)
- scans image (`Trivy`)
- gestion des secrets:
  - `k8s/jwt-secret.secret.yaml.example` versionné
  - fichier réel `*.secret.yaml` ignoré par Git

## Structure projet (conforme cahier de charge)

- `frontend/`
- `backend/`
- `docker/`
- `k8s/`
- `.github/workflows/`
- `docs/agile/`
- `docs/improve.md`

## Validation rapide avant soutenance

1. `docker compose up --build`
2. vérifier `http://localhost:5000/health`
3. vérifier `http://localhost:5000/metrics`
4. vérifier exécution CI/CD dans GitHub Actions
5. vérifier ArgoCD: app `Healthy` + `Synced`
6. vérifier dashboard Grafana + alerte Prometheus

