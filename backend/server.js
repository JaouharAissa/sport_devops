const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const path = require("path");
const fs = require("fs");
const client = require("prom-client");

// Import des routes
const users = require("./routes/api/users");
const produits = require("./routes/api/produits");
//const exercicesRoutes = require("./routes/api/exercices");  // Routes pour les exercices
const adminRoutes = require("./routes/api/adminRoutes");  // Import des routes d'administration

const app = express();

app.use(express.json());
app.use(cors());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ---- Observability (Prometheus) ----
client.collectDefaultMetrics({
  prefix: "fitness_",
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "fitness_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    const route = (req.route && req.route.path) || req.path || "unknown";
    end({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });
  });
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).json({ error: "metrics_error" });
  }
});

// Connexion à MongoDB
const mongoUrl =
  process.env.MONGO_URL ||
  process.env.MONGO_URI ||
  config.get("mongo_url");
mongoose.set('strictQuery', true);
mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log("Erreur de connexion à MongoDB :", err));

// Définition des routes API
app.use("/users", users);  // Routes pour les utilisateurs
app.use("/produits", produits);  // Routes pour les produits
//app.use("/exercices", exercicesRoutes);  // Routes pour gérer les exercices avec upload de GIF

// Routes d'administration avec le préfixe /admin
app.use("/admin", adminRoutes);  // Préfixe /admin pour les routes d'administration

// Configuration du dossier statique pour les fichiers GIF (upload)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`));
