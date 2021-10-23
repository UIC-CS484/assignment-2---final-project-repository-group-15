"use strict";
const bcrypt = require("bcrypt");
const query = require("../config/query");
const db = require("../config/sqlite3").db;

// Render the welcome page
module.exports.welcome = (req, res) => {
  return res.render("welcome.ejs");
};

// Render the register page
module.exports.register = (req, res) => {
  if (req.isAuthenticated()) {
    //error.push("Already logged in");
    return res.redirect("dashboard");
  }
  return res.render("register");
};

// Render the login page
module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    //error.push("Already logged in");
    return res.redirect("dashboard");
  }
  return res.render("login");
};

// Render the dashboard page
module.exports.dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("dashboard", {
      name: req.user.name,
    });
  }
  req.flash("error_msg", "Please login to view this resource");
  return res.redirect("login");
};

// Render the 404 page
module.exports.notFound = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("dashboard", {
      name: req.user.name,
    });
  }
  req.flash("error_msg", "How did you found your self here?");
  return res.render("welcome.ejs");
};

// Register Handle
module.exports.createUser = (req, res) => {
  // Pulling some variables from req.body
  const { name, email, password, password2 } = req.body;
  // For validation let us first create an array
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password != password2) {
    errors.push({ msg: "Password do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    // Hash Password

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          // Set password to hashed password
          const params = [req.body.name, req.body.email, hash];
          console.log(hash);
          // Save user in db
          db.run(query.INSERT_ACCOUNT, params, (dbErr, row) => {
            // User exists
            if (dbErr) {
              errors.push({ msg: "Email is already regsitered" });
              res.render("register", {
                errors,
                name,
                email,
                password,
                password2,
              });
            } else {
              // User was not system hence, created it.
              // We want to redirect to login
              // But before we want to display the messages using flash
              req.flash("success_msg", "You are now registered and can login");
              res.redirect("/users/login");
            }
          });
        }
      })
    );
    //console.log(params);
    // res.send('pass')
  }
  //console.log(req.body)
};

// Login Handle
module.exports.createSession = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Logged In");
    console.log("I am IN");
    return res.redirect("/users/dashboard");
  }
  res.redirect("/users/login");
};

// Logout handle
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

module.exports.deleteUser = (req, res) => {
  console.log("Inside controller");
  var name = req.user.name;
  req.logout();
  //console.log(`User: ${req.user.name}`);
  db.run(query.DELETE_ACCOUNT, name, (dbErr, row) => {
    if (dbErr) {
      errors.push({ msg: "User does not exists!" });
      res.redirect("/");
    } else {
      // User was not system hence, created it.
      // We want to redirect to login
      // But before we want to display the messages using flash
      console.log("Inside else now");
      //req.flash("success_msg", "Account successfully deleted!");
      res.redirect("/");
    }
  });
};
