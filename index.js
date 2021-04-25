// IMPORTS AND SETUP
const express = require('express');
const connectDB = require('./server/database/config');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passportSetup = require("./server/passport/setup");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const User = require("./server/schemas/User");

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
app.use(bodyParser.urlencoded({ extended: true }));



// LISTEN TO AUTH ROUTES
app.post("/signup", async (req, res) => {

    let { email, password } = req.body;

    let user = await User.findOne({ email }).exec();

    if(!user) {
        
        if(!email) {
            res.json({
                success: false,
                msg: "Please enter an email!"
            });
        }

        if(password.length < 8) {
            res.json({
                success: false,
                msg: "Your password must be at least 8 characters long"
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {

                let newUser = new User({ email, password: hash });
                await newUser.save();

                console.log("Successfully registered " + email);
                res.json({
                    success: true,
                    msg: "We've successfully signed you up!"
                });
            })
        })
    } else {

        res.json({
            success: false,
            msg: "This email is already taken"
        });
    }
});

app.post("/signin", async (req, res, next) => {

    let { email, password } = req.body;
    let user = await User.findOne({ email }).exec();

    if(user) {

        bcrypt.compare(password, user.password, (err, matches) => {

            if(matches) {
                next();
            } else {
                res.json({ success: false, msg: "Your email or password is incorrect" });
            }
        });
    } else {
        res.json({ success: false, msg: "Your email or password is incorrect" });
    }
}, passport.authenticate('local', {
    successRedirect: '/home' // This redirect doesn't work, but I did a frontend workaround
}));

app.get("/signout", (req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
})

// LISTEN TO PRIVATE ROUTES
app.get("/bookmarks", async (req, res) => {
    if(req.isAuthenticated()) {
        let user = await User.findOne({ email: req.user.email }).exec();
        res.render(__dirname + '/client/views/private/bookmarks.ejs', { pageName: "My Bookmarks", bookmarks: JSON.stringify(user.bookmarks) });
    } else {
        res.redirect("/");
    }
});

app.get("/home", (req, res) => {
    if(req.isAuthenticated()) {
        res.render(__dirname + '/client/views/private/home.ejs');
    } else {
        res.redirect("/");
    }
});

app.post("/updateBookmarks", async (req, res) => {
    if(req.isAuthenticated()) {

        let bookmarks = JSON.parse(req.body.bookmarks);
        let email = req.user.email;
        
        await User.updateOne({ email },{
            $set: { bookmarks },
            $currentDate: { lastModified: true }
        });

        res.json({ success: true, msg: "Successfully saved bookmarks!" });
    } else {
        res.json({ success: false, msg: "Not authenticated" });
    }
});

// LISTEN TO PUBLIC ROUTES
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