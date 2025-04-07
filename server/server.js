const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const scanController = require("./controllers/scanController");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" })); // Autorise les requêtes du front
app.use(express.json()); // 🔥 Middleware pour parser le JSON

app.use("/api", routes); // Toutes les routes de l'API

app.get("/", (req, res) => {
  res.send("Serveur Node.js fonctionne !");
});

app.get('/scan', scanController.scan); // Route pour le scan UDP

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
