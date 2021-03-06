const express = require("express"); //pour gérer les requêtes http
const bodyParser = require("body-parser"); //pour extraire l'objet JSON de la demande. Il nous faudra le package body-parser
const path = require("path"); //chemin du server

//const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

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

//app.use("/api/Posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
