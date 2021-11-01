const express = require("express");
const router = express.Router(); //on enregistre nos routes dans le routeur Express

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // placer le middleware multer après auth

const postCtrl = require("../controllers/post");
// on remplace les app par router et on sécurise avec auth
router.get("/", auth, postCtrl.getAllPost);
router.post("/", auth, multer, postCtrl.createPost); // les images des requêtes non authentifiées seront enregistrées dans le serveur si multer avant auth
router.get("/:id", auth, postCtrl.getOnePost);
router.put("/:id", auth, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.post("/:id/like", auth, postCtrl.likePost);

module.exports = router;
