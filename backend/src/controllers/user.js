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
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        /*imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,*/
        isAdmin: req.body.isAdmin,
      });
      User.create(user, (err, data) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error });
          return;
        }
        res.status(201).json({ message: "Utilisateur créé !" });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  //vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
  User.findByEmail(req.body.email, (err, user) => {
    if (err) {
      return res.status(401).json({ err });
    }
    bcrypt //comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
      .compare(req.body.password, user.password)
      .then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        res.status(200).json({
          //envoie de l id et du token
          userId: user.id,
          token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
            //pour encoder un nouveau token il contient l'Id
            expiresIn: "24h",
          }),
        });
      })
      .catch((error) => res.status(500).json({ error }));
  });
};

exports.findOne = (req, res, next) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      return res.status(500).json({
        err,
      });
    }
    res.status(200).json(user);
  });
};

exports.update = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  User.updateById(req.params.userId, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating User with id " + req.params.userId,
        });
      }
    } else res.send(data);
  });
};
