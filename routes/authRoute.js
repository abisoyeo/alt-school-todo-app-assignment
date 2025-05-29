const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../validators/authValidator");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", validate(signupSchema), authController.signupUser);
router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);

module.exports = router;
