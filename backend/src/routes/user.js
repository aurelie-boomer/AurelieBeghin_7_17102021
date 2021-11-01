const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:userId", userCtrl.findOne);
router.put("/:userId", userCtrl.update);
//router.delete("/:userId", userCtrl.delete);

module.exports = router;
