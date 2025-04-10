const express = require('express');
const dgram = require('dgram');
const cors = require('cors');
const routes = require("./routes/routes");

const app = express();
const port = 3000;

app.use(cors()); // Autorise les requêtes depuis React
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`API Express démarrée sur http://localhost:${port}`);
});
