// Base URL de l'API.
// - Dev local: backend sur http://localhost:5000
// - Docker Compose / K8s: idéalement proxy via Nginx/Ingress => API_URL peut rester vide ("")
// - Override: REACT_APP_API_URL au build CRA
const API_URL =
  process.env.REACT_APP_API_URL ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_URL;