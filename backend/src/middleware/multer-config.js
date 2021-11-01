const multer = require("multer"); //Multer pour gérer des fichiers entrants

const MIME_TYPES = {
  // = extension du fichier
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // indique où stocker les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, "images"); //save dans le dossier "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //on remplace les espaces par des underscores pour les noms créés
    const extension = MIME_TYPES[file.mimetype]; //type d'extension
    callback(null, name + Date.now() + "." + extension); //création d un nom de fichier unique
  },
});

module.exports = multer({ storage: storage }).single("image"); // on explique à multer que ce sont des images
