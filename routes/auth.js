const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const authController = require("../controller/auth");

router.get("/", authController.getUsers);
router.get("/board", upload.none(), authController.something);
router.post("/signup", upload.single("file"), authController.userSignup);
router.post("/board", upload.single("file"), authController.boardSignup);
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
