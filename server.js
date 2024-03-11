const express = require('express');
const app = express();
app.use(express.static('public'));
let users = [];
let tokens = [];
let reviews = [];
let games = [{"gameID": 1, "numReviews": 0, "totalScore": 0},{"gameID": 2, "numReviews": 0, "totalScore": 0},{"gameID": 3, "numReviews": 0, "totalScore": 0},{"gameID": 4, "numReviews": 0, "totalScore": 0}];
app.use(express.json());
//Middleware for registering x user with password z
app.post('/register', (req, res, next) => {
    const username = req.body.name;
    const password = req.body.password;
    //return authtoken if succesful, error if fail
    if(checkUser(username) === null){
        users.push({"username": username, "password": password});
        const authToken = tokenGenerator(username);
        res.status(200).send(JSON.stringify({"token": authToken}));
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
            return i;
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
function checkGame(y){
    for (i in games){
        if(i.gameID === y){
            return i;
        } 
    }
    return null;
}
//Middleware for submitting x users review score of game y
app.post('/score', (req, res, next) => {
    const token = req.body.token;
    const name = checkAuth(token);
    if (name != null){
        const gameID = req.body.gameID;
        const score = req.body.score;
        reviews.push({"username": name, "gameID": gameID, "score": score});
        let game = checkGame(gameID);
        game.totalScore += score;
        game.numReviews++;
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});
//Middleware for updating x users review score of game y
app.put('/score', (req, res, next) => {
    const token = req.body.token;
    const name = checkAuth(token);
    if (name != null){
        const gameID = req.body.gameID;
        const score = req.body.score;
        let review = checkReview(name,gameID);
        const totalScore = score - review.score;
        review.score += totalScore;
        let game = checkGame(gameID);
        game.totalScore += totalScore;
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});
//Middleware for logout
app.delete('/user', (req, res, next) => {
    const token = req.query.token;
    const name = checkAuth(token);
    if(name != null){
        tokens.filter(filterToken);
        function filterToken(obj){
            return obj.username != name;
        }
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});
//Middleware for getting number of reviews and total score of game y
app.get('/review', (req, res, next) => {
    const gameID = req.query.gameID;
    let game = checkGame(gameId);
    res.status(200).send({"numReviews": game.numReviews, "totalScore": game.totalScore});
});
//Middleware for checking if user has submitted review for submitted game
app.get('/score', (req,res,next) =>{
    const gameID = req.query.gameID;
    const username = req.query.username;
    const review = checkReview(username,gameID);
    if(review != null){req.status(200).send();}
    else {req.status(404).send();}
});
//Middleware for logging in user x with password z
app.post('/user', (req, res, next) => {
    const name = req.body.username;
    pass = checkUser(name);
    if(pass === null){
        res.status(404).send();
    } else if (pass === req.password){
        const authToken = tokenGenerator(username);
        res.status(200).send({"token": authToken});
    } else {
        res.status(401).send();
    }
});
//middleware for checking if a authtoken is valid
app.get('/user', (req, res, next) => {
    const token = req.query.token;
    const name = checkAuth(token);
    if(name != null){
        res.status(200).send(JSON.stringify({"username": name}));
    } else {
        res.status(401).send();
    }
});
function tokenGenerator(username){
    const uuid = String(crypto.randomUUID());
    tokens.push({"username": username, "token": uuid});
}
const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});