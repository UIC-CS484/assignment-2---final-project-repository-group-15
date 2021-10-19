const express = require('express')
// We will require express-ejs-layouts for our views
const expressLayout = require('express-ejs-layouts')
// We need to bring in mongoose for our databse
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport config
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    // This gives us a promise, so will do .then() once connection is successful
    // and .catch() to catch the error and print it out in the console
    .then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))

// Middleware EJS
app.use(expressLayout)
app.set('view engine', 'ejs')

// Bodyparser Middleware
app.use(express.urlencoded({ extended: false }))

// Express Session middleware
const session_config = {
		secret: 'secret', //a random unique string key used to authenticate a session
		resave: true, //nables the session to be stored back to the session store, even if the session was never modified during the request
		saveUninitialized: true, //his allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.
		cookie: { secure: true } //true is a recommended option. However, it requires an https-enabled website
		//store  parameter when saving session to database
};

session_config.cookie.secure = false;
// IMPORTANT REVIEW IN CLASS - https://expressjs.com/en/resources/middleware/session.html

// Express Sessions
app.use(session(session_config))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash middleware
app.use(flash())

// Global Vars for flash color messges
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server started on port ${PORT}`))