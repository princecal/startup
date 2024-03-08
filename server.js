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
    if(checkName(username)){
        users.push({username: username, password: password});
        const authToken = String(crypto.randomUUID());
        tokens.push({username: username, token: authToken});
        res.status(200).send({token: authToken});
    }else {
        res.status(401).send();
    }
  });

function checkName(x) {
    for (i in users){
        if(i.username === x){
            return true;
        }
    }
    return false;
}
function checkReview(x,y){
    for (i in reviews){
        if(i.username === x && i.gameID === y){
            return i.score;
        } else {
            return null;
        }
    }
}
function checkAuth(w,x){
    for (i in tokens){
        if(i.token === w){
            return i.username;
        } else {
            return null;
        }
    }
}

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
function tokenGenerator(username){
    const uuid = String(crypto.randomUUID());
    localStorage.setItem(uuid,username);
    localStorage.setItem("authToken", uuid);
}
const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});