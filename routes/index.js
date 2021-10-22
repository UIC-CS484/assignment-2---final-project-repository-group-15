// We will use express, so we bring that in with require
const express = require("express");
// To use express.Router() we need a const variable called router
const router = express.Router();
const userController = require("../controllers/user_controller");
// This middleware will check if
//const { ensureAuthenticated } = require("../config/auth");

// Welcome page
router.get("/", userController.welcome);
// Dashboard Page
/**
router.get("/users/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
  })
);
*/
// User page
router.use("/users", require("./users"));

// This module.exports will allow us to use router.get() somewhere else(in other .js file)
module.exports = router;
