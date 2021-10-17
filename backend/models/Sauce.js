const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  //schéma de données mise à dispo par mongoose
  //Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

module.exports = mongoose.model("Sauce", sauceSchema); //En l'exportant nous le rendons dispo pour l'application express
