const express = require("express"); //pour gérer les requêtes http
const bodyParser = require("body-parser"); //pour extraire l'objet JSON de la demande. Il nous faudra le package body-parser
const mongoose = require("mongoose"); //pour stocker des données
const path = require("path"); //chemin du server

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://aurelie_boomer:Chouchou13430.@cluster0.hsb46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true } //connection de l'API au cluster
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
//
app.use((req, res, next) => {
  //CORS
  // ce middleware s'applique à toutes les routes
  res.setHeader("Access-Control-Allow-Origin", "*"); //accéder à notre API depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    //ajouter les headers mentionnés aux requêtes envoyées vers notre API
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    //envoyer des requêtes avec les méthodes mentionnées
  );
  next(); //pour passer l'exécution au middleware suivant
});

app.use(bodyParser.json());
//autoriser express à servir les fichiers images afin de pouvoir diffuser les images téléchargées
app.use("/images", express.static(path.join(__dirname, "images")));
//indiquer à notre app.js comment traiter les requêtes vers la route /image , en rendant notre dossier images statique

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
