const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //middleware pour protéger les routes et authentifier l'utilisateur avant envoi des requetes
  try {
    const token = req.headers.authorization.split(" ")[1]; //pour récupérer tout après l'espace dans le header
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //fonction verify pour décoder notre token.
    //chaîne secrète de développement temporaire
    const userId = decodedToken.userId; //extraction de l'Id de l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      //si la demande contient un ID utilisateur, nous le comparons à celui extrait du token
      throw "Invalid user ID"; // renvoi l'erreur
    } else {
      //utilisateur authentifié
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("unauthorized request"),
    });
  }
};
