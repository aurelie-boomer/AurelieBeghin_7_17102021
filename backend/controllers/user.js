const bcrypt = require("bcrypt"); //package de chiffrement
const jwt = require("jsonwebtoken"); //Pour pouvoir créer et vérifier les tokens d'authentification

const User = require("../models/User");
exports.signup = (req, res, next) => {
  //fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré
  bcrypt
    .hash(req.body.password, 10) //algorithme de hachage=10 tours pour sécuriser
    .then((hash) => {
      const user = new User({
        //création d'un nouvel utilisateur
        email: req.body.email,
        password: hash, //on enregistre le mdp crypté
      });
      user
        .save() //on enregistre le nouvel utulisateur dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => {
          console.log(error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  //vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt //comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            //envoie de l id et du token
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              //pour encoder un nouveau token il contient l'Id
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
