const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  //schéma de données mise à dispo par mongoose
  //Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
  title: { type: String, required: true },
  comments: { type: String, required: true },
  userId: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});
// mettre l'heure du post??

module.exports = mongoose.model("Post", postSchema); //En l'exportant nous le rendons dispo pour l'application express
