# Improve (Continuous Improvement)

## Points faibles identifiés
- MongoDB en `emptyDir` (non persistant).
- Aucune stratégie de rollback automatisée sur incident.
- Couverture tests backend/frontend encore faible.

## Améliorations proposées
- Remplacer `emptyDir` par PVC + backup snapshots.
- Ajouter tests e2e (Playwright/Cypress) sur PR.
- Ajouter policy-as-code (OPA/Gatekeeper/Kyverno).
- Ajouter SAST dédié (Semgrep/CodeQL) en complément Sonar.
- Ajouter alert routing (Alertmanager -> email/Slack/Teams).
