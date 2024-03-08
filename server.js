const express = require('express');
const app = express();
app.use(express.static('public'));
app.post('/register', (req, res, next) => {
    const username = req.name;
    const password = req.password;
    //add username and password to the database
    //return authtoken if succesful, error if fail
    const authToken = String(crypto.randomUUID());
    //add authtoken into auth database
    res.status(200).send({token: authToken});
  });
const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

//Middleware for getting x users review score of game y
app.get('score', (req, res, next) => {

});
//Middleware for submitting x users review score of game y
app.post('score', (req, res, next) => {
    
});
//Middleware for updating x users review score of game y
app.put('score', (req, res, next) => {
    
});
//Middleware for logout
app.delete('user', (req, res, next) => {
    
});
//Middleware for getting number of reviews and total score of game y
app.get('review', (req, res, next) => {
    
});
//Middleware for logging in user x with password z
app.post('user', (req, res, next) => {
    
});