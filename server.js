const express = require('express');
const app = express();
app.use(express.static('public'));
let users = [];
let tokens = [];
let reviews = [];
//Middleware for registering x user with password z
app.post('/register', (req, res, next) => {
    const username = req.name;
    const password = req.password;
    
    //return authtoken if succesful, error if fail
    if(checkUser(username) === null){
        users.push({username: username, password: password});
        const authToken = tokenGenerator(username);
        res.status(200).send({token: authToken});
    }else {
        res.status(401).send();
    }
  });

function checkUser(x) {
    for (i in users){
        if(i.username === x){
            return i.password;
        }
    }
    return null;
}
function checkReview(x,y){
    for (i in reviews){
        if(i.username === x && i.gameID === y){
            return i.score;
        } 
    }
    return null;
}
function checkAuth(w){
    for (i in tokens){
        if(i.token === w){
            return i.username;
        } 
    }
    return null;
}

//Middleware for getting x users review score of game y
app.get('/score', (req, res, next) => {

});
//Middleware for submitting x users review score of game y
app.post('/score', (req, res, next) => {
    
});
//Middleware for updating x users review score of game y
app.put('/score', (req, res, next) => {
    
});
//Middleware for logout
app.delete('/user', (req, res, next) => {
    
});
//Middleware for getting number of reviews and total score of game y
app.get('/review', (req, res, next) => {
    
});
//Middleware for logging in user x with password z
app.post('/user', (req, res, next) => {
    
});
//middleware for checking if a authtoken is valid
app.get('/user', (req, res, next) => {
    const token = req.token;
    const name = checkAuth(token);
    if(name != null){
        res.status(200).send({username: name});
    } else {
        res.status(401).send();
    }
});
function tokenGenerator(username){
    const uuid = String(crypto.randomUUID());
    tokens.push({username: username, token: uuid});
}
const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});