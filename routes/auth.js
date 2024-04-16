const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controller/auth");

router.get("/", authController.getUsers);
router.get("/board", authController.something);
router.post("/signup", authController.userSignup);
router.post("/board", authController.boardSignup);
router.post(
  "/signin",
  [
    body("email", "email is invalid").isEmail().not().isEmpty(),
    body("password", "password should not be less than 8 characters long")
      .isLength({ min: 8 })
      .not()
      .isEmpty(),
  ],
  authController.userLogin
);

module.exports = router;
