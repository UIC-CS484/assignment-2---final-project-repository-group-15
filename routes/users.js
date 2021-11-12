// We will use express, so we bring that in with require
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");

const router = express.Router();
const userController = require("../controllers/user_controller");

// User model
const query = require("../config/query");
//const db = require("../models/database").db;

// Login Page
router.get("/login", userController.login);

// Register Page
router.get("/register", userController.register);

// Dashboard Page
router.get("/dashboard", userController.dashboard);

// Register Handle
router.post("/register", userController.createUser);

// Login handle
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  userController.createSession
);

// Delete account handle
router.get("/delete", userController.deleteUser);

// Logout handle
router.get("/logout", userController.logout);

// 404 Page
router.get("*", userController.notFound);

//API calls
router.post("/submit",userController.submit);

// //API call for cCTA
// router.post('/go',userController.getTimes);

// This module.exports will allow us to use router.get() somewhere else(in other .js file)
module.exports = router;
