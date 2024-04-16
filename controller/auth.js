const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

dotenv.config();

const User = require("../model/user");
const Board = require("../model/board");

const error = require("../util/error-handling/errorHandler");

const { userExists } = require("../util/user");

/**************
 * User Signup*
 * ************/
module.exports.userSignup = async (req, res, next) => {
  const email = req.body.email,
    firstName = req.body.firstName,
    lastName = req.body.lastName,
    password = req.body.password,
    phoneNumber = req.body.phoneNumber,
    state = req.body.state,
    address = req.body.address,
    position = req.body.position,
    zone = req.body.zone,
    title = req.body.title,
    profileImage = req.body.profileImage;

  try {
    // Check for validation errors
    const validatorErrors = validationResult(req);
    error.validationError(validatorErrors, res);

    // Check if a email already exist
    const emailExist = await userExists("email", email);
    if (emailExist) {
      error.errorHandler(res, "email already exists", "email");
    } else {
      // Continue if there are no errors
      const hashedPassword = await bcrypt.hash(password, 5);

      // Create new user object
      const user = new User({
        firstName,
        lastName,
        details: {
          email,
          phoneNumber,
          state,
          address,
          zone,
          position,
          title,
        },
        password: hashedPassword,
        profileImage,
      });

      // Save user in database
      const newUser = await user.save();

      // Send response back to client
      res
        .status(200)
        .json({ message: "Sign up successful", type: "user", newUser });
    }
  } catch (err) {
    error.error(err, next);
  }
};

/***************
 * Board Signup*
 * *************/
module.exports.boardSignup = async (req, res, next) => {
  const email = req.body.email,
    firstName = req.body.firstName,
    lastName = req.body.lastName,
    password = req.body.password,
    phoneNumber = req.body.phoneNumber,
    state = req.body.state,
    address = req.body.address,
    position = req.body.position,
    zone = req.body.zone,
    title = req.body.title,
    profileImage = req.body.profileImage;

  try {
    // Check for validation errors
    const validatorErrors = validationResult(req);
    error.validationError(validatorErrors, res);

    // Check if a email already exist
    const emailExist = await Board.findOne({ details: { email: email } });
    if (emailExist) {
      error.errorHandler(res, "email already exists", "email");
    } else {
      // Continue if there are no errors
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user object
      const user = new Board({
        firstName,
        lastName,
        details: {
          email,
          phoneNumber,
          state,
          address,
          zone,
          position,
          title,
        },
        password: hashedPassword,
        profileImage,
      });

      // Save user in database
      const newUser = await user.save();

      // Send response back to client
      res
        .status(200)
        .json({ message: "Sign up successful", type: "user", newUser });
    }
  } catch (err) {
    error.error(err, next);
  }
};

/**************
 * User Login *
 **************/
module.exports.userLogin = async (req, res, next) => {
  const email = req.body.email,
    password = req.body.password;

  try {
    // Check for validation errors
    const validatorErrors = validationResult(req);
    error.validationError(validatorErrors);

    // Check if user exists
    const user = await userExists("email", email);

    if (!user) error.errorHandler(res, "incorrect email", "email");

    // Check for password match
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      error.errorHandler(res, "Incorrect password", "password");

    // Continue if there are no errors

    // Create jsonwebtoken
    const token = jwt.sign(
      { user: user, email: user.email },
      process.env.jwtKey,
      { algorithm: "HS256", expiresIn: process.env.jwtExpirySeconds }
    );

    // Send response to client
    res.status(200).json({ token });
  } catch (err) {
    error.error(err, next);
  }
};

/*****************
 * Get all Users *
 *****************/
module.exports.getUsers = async (req, res, next) => {
  try {
    // Get user
    const users = await User.find();

    // Check if user is undefined
    if (!users) error.errorHandler(res, "No user found", "user");

    // Send response back to client
    res.status(201).json({ message: "users fetched", users });
  } catch (err) {
    error.error(err, next);
  }
};

/*****************
 * try something *
 *****************/
module.exports.something = async (req, res, next) => {
  try {
    // Get user
    const users = await Board.find();

    // Check if user is undefined
    if (!users) error.errorHandler(res, "No user found", "user");

    // Send response back to client
    res.status(201).json({ message: "users fetched", users });
  } catch (err) {
    error.error(err, next);
  }
};
