const Post = require("../models/Post");
const fs = require("fs"); //permet de modifier le système de fichiers et de supprimer les fichiers images

exports.createPost = (req, res, next) => {
  console.log("post créée");
  const postObject = JSON.parse(req.body.post); //pour obtenir un objet utilisable
  delete postObject._id;
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      //URL complète de notre image //req.protocol=http
      req.file.filename
    }`,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "post enregistré !" }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (post.userId !== req.body.userId) {
      res.status(403).json({ message: "requête non autorisée" }); //seul le propiétaire du post peut le modifier
      return;
    }
    const postObject = req.file
      ? {
          //existe ou non
          ...JSON.parse(req.body.post), //analyse la requete en objet utilisable
          //résoudre l'url complete
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    Post.updateOne(
      { _id: req.params.id },
      { ...postObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "post modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.deletePost = (req, res, next) => {
  //supprime l'image (fichier et objet) du dossier images et visuellement
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      const filename = post.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // supprime le fichier
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likePost = (req, res, next) => {
  //Gestion des likes et dislikes
  const like = req.body.like;
  const userId = req.body.userId;

  Post.findOne({ _id: req.params.id }) //on recherche un post
    .then((post) => {
      if (like === 1) {
        // clic sur le like
        if (!post.usersLiked.includes(userId)) {
          // si l'user est différent alors on incrémente 1
          post.usersLiked.push(userId);
          post.likes++;
          post
            .save()
            .then(() => res.status(201).json({ message: "Post liké" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          //sinon on refuse le clic
          res
            .status(403)
            .json({
              message: "Vous ne pouvez pas liker deux fois le même post",
            })
            .catch((error) => res.status(400).json({ error }));
        }
      } else if (like === -1) {
        // clic sur le dislike
        if (!post.usersDisliked.includes(userId)) {
          //si l'user est différent alors on incrémente -1
          post.usersDisliked.push(userId);
          post.dislikes++;
          post
            .save()
            .then(() => res.status(201).json({ message: "Post disliké" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res
            .status(403)
            .json({
              message: "Vous ne pouvez pas disliker deux fois le même post",
            })
            .catch((error) => res.status(400).json({ error }));
        }
      } else if (like === 0) {
        // like enlevé
        if (post.usersLiked.includes(userId)) {
          //si c'est le même user qui a déjà liké ce post
          post.usersLiked.pull(userId);
          post.likes--; // on enlève le like
          post
            .save()
            .then(() => res.status(201).json({ message: "Post unliké" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (post.usersDisliked.includes(userId)) {
          //si c'est le même user qui a déjà liké ce post
          post.usersDisliked.pull(userId);
          post.dislikes--; //on enlève le dislike
          post
            .save()
            .then(() => res.status(201).json({ message: "Post undisliké" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res
            .status(403)
            .json({ message: "Vous ne pouvez pas intéragir" })
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
