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
- Lint + tests backend
- Lint + tests + build frontend
- Build Docker images (validation)

## Observability

- **/metrics** expose les métriques Node + histogramme HTTP (`fitness_http_request_duration_seconds`)
- Pour Prometheus Operator, tu pourras remplacer les annotations par un **ServiceMonitor**.

