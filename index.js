// IMPORTS AND SETUP
const express = require('express');
const connectDB = require('./server/database/config');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passportSetup = require("./server/passport/setup");
const { mongo } = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = express();
const sessionSecret = process.env.SESSION_SECRET || "Local secret";
const URI = process.env.DB_URI || "mongodb+srv://TestUser:YhkUxReF6JVvzOvr@librowser.15gs2.mongodb.net/Test?retryWrites=true&w=majority";

let mongoose = connectDB(URI);

// Passport & session setup
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: URI, collection: 'sessions' })
}))

app.use(passportSetup.initialize());
app.use(passportSetup.session());



// LISTEN TO POST ROUTES
app.post("/signup", async (req, res, next) => {

    let { email, password } = req.body;

    let user = await User.findOne({ email }).exec();

    if(!user) {
        
        if(password.length < 8) {
            res.json({
                success: false,
                msg: "Your password must be at least 8 characters long"
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {

                if(err) {
                    throw err;
                }

                let newUser = new User({ email, password: hash });
                await newUser.save();

                passport.authenticate('local', { successRedirect: '/home' });
            })
        })
    }

    res.json({
        success: false,
        msg: "This email is already taken"
    });
});

app.post("/signin", passport.authenticate('local', {
    successRedirect: '/home'
}));

// LISTEN TO VIEW ROUTES
app.get("/", (req, res) => {
    if(!req.isAuthenticated()) {
        res.render(__dirname + '/client/views/public/landing.ejs');
    } else {
        res.redirect("/home");
    }
});

app.get("/signup", (req, res) => {
    if(!req.isAuthenticated()) {
        res.render(__dirname + '/client/views/public/signup.ejs', { pageName: "Sign Up" });
    } else {
        res.redirect("/home");
    }
});

app.get("/signin", (req, res) => {
    if(!req.isAuthenticated()) {
        res.render(__dirname + '/client/views/public/signin.ejs', { pageName: "Sign In" });
    } else {
        res.redirect("/home");
    }
});

app.get("*", (req, res) => {
    res.redirect('/');
});



// START SERVER
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});