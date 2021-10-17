const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); //pour gérer les erreurs générées par défaut par MongoDB

const userSchema = mongoose.Schema({
  //schéma utilisateur
  email: { type: String, required: true, unique: true }, //email unique
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
