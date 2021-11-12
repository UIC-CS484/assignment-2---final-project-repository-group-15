const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

const query = require("./config/query");

/** Middleware Section */

// Setting view engine - EJS_Middleware
app.use(expressLayout);
app.set("view engine", "ejs");

// Parse URL-Encoded body - Bodyparser_Middleware
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: "auto" },
    store: new SQLiteStore({
      table: "sessions",
      db: "./db/mock.db",
    }),
  })
);

// DB Config
//const db = require("./models/database").db;

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash Middleware
app.use(flash());

// Global Vars for flash color messges
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
