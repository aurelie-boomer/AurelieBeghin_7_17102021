const express = require("express");
const router = express.Router(); //on enregistre nos routes dans le routeur Express

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // placer le middleware multer après auth

const sauceCtrl = require("../controllers/sauce");
// on remplace les app par router et on sécurise avec auth
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce); // les images des requêtes non authentifiées seront enregistrées dans le serveur si multer avant auth
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
