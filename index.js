// IMPORTS AND SETUP
const express = require('express');
const connectDB = require('./server/database/config');
const User = require('./server/schemas/User');

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();



// LISTEN TO POST ROUTES
app.post("/signin", (req, res) => {

});

app.post("/signup", (req, res) => {
    
});

// LISTEN TO VIEW ROUTES
app.get("/", (req, res) => {
    res.render(__dirname + '/client/views/public/landing.ejs');
});

app.get("/signup", (req, res) => {
    res.render(__dirname + '/client/views/public/signup.ejs');
});

app.get("/signin", (req, res) => {
    res.render(__dirname + '/client/views/public/signin.ejs');
});

app.get("*", (req, res) => {
    res.redirect('/');
});



// START SERVER
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});