const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../schemas/User");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
        next(err, user);
    });
});

const strategy = new LocalStrategy({ usernameField: "email" }, async (email, password, next) => {
    
    let user = await User.findOne({ email }).exec();

    if(user) {

        bcrypt.compare(password, user.password, (err, matches) => {
            
            if(err) {
                throw err;
            }

            if(matches) {
                return next(null, user);
            } else {
                return next(null, false, { message: "Your password is incorrect" });
            }
        });
    }
});

passport.use(strategy);

module.exports = passport;