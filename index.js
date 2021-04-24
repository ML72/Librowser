// IMPORTS AND SETUP
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();



// LISTEN TO VIEW ROUTES
app.get("/", (req, res) => {
    res.render(__dirname + '/client/views/landing.ejs');
});

app.get("*", (req, res) => {
    res.redirect('/');
});



// START SERVER
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});