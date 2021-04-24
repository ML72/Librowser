const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../schemas/User");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

const strategy = new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    
    // This is a temporary workaround to a bug that I couldn't figure out when crafting signin
    // I implemented my own middleware to circumvent passport idiosyncrasies
    let user = await User.findOne({ email }).exec();
    return done(null, user);
});

passport.use(strategy);

module.exports = passport;