const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/database").db;
const bcrypt = require("bcrypt");
const query = require("./query");

// Load User Model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        // Match User
        db.get(query.GET_ACCOUNT, email, (err, row) => {
          if (err) {
            throw err;
          } else if (!row) {
            // Email not found
            return done(null, false, {
              message: "That email is not registered",
            });
          } else {
            // Email exists in databse
            bcrypt.compare(password, row.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, row);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.name);
  });

  passport.deserializeUser((name, done) => {
    db.get(query.GET_NAME, name, (err, user) => {
      console.log(user);
      done(err, user);
    });
  });
};
