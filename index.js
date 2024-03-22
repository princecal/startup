const express = require('express');
const app = express();
app.use(express.static('public'));
const crypto = require('crypto');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('gameReviews');
const users = db.collection('users');
const tokens = db.collection('tokens');
const reviews = db.collection('reviews');
const games = db.collection('games');
app.use(express.json());
app.use(cookieParser());
async function main() {
    (async function testConnection() {
        await client.connect();
        await db.command({ ping: 1 });
      })().catch((ex) => {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
      });
    for (i = 1; i < 5; i++){
        let name = "";
        switch(i){
            case 1: name = "Pokemon Scarlet/Violet"; break; 
            case 2: name = "Super Mario Bros. Wonder"; break; 
            case 3: name = "Tears of the Kingdom"; break; 
            case 4: name = "Lord of the Rings: Gollum"; break; 
        }
        games.updateOne({ gameID : i }, 
           {
            $setOnInsert: {gameID : i, name: name, numReviews: 0, totalScore: 0}
           },
           {upsert: true})
    }
}


async function checkUser(x) {
    const document = await users.findOne({username: x});
    if(document){
        return document;
    } else {
        return null;
    }
}
async function checkReview(x,y){
    const document = await reviews.findOne({username: x, gameID: y});
    if(document){
        return document;
    } else {
        return null;
    }
}
async function checkAuth(w){
    const document = await tokens.findOne({tokens: w});
    if(document){
        return document.username;
    } else {
        return null;
    }
}
async function checkGame(y){
    const document = await users.findOne({gameID: y});
    if(document){
        return document;
    } else {
        return null;
    }
}
//Middleware for registering x user with password z
app.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    //return authtoken if succesful, error if fail
    if(checkUser(username) === null){
        users.push({username: username, password: password});
        const authToken = tokenGenerator(username);
        res.status(200).send(JSON.stringify({token: authToken}));
    }else {
        res.status(401).send();
    }
  });
//Middleware for submitting x users review score of game y
app.post('/score', async (req, res, next) => {
    const token = req.body.token;
    const name = checkAuth(token);
    if (name != null){
        const gameID = Number(req.body.gameID);
        const score = Number(req.body.score);
        reviews.insertOne({username: name, gameID: gameID, score: score});
        let game = checkGame(gameID);
        const totalScore = game.totalScore + score;
        const numReviews = game.numReviews + 1;
        games.updateOne({gameID: gameID}, {$set: {gameID: gameID, totalScore: totalScore, numReviews: numReviews}});
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
        const gameID = Number(req.body.gameID);
        const score = Number(req.body.score);
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
app.delete('/user', async (req, res, next) => {
    const token = req?.cookies.token;
    const name = await checkAuth(token);
    if(name != null){
        tokens.remove({token: token});
        res.cookie('token', "", {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          });
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});
//Middleware for getting number of reviews and total score of game y
app.get('/review', (req, res, next) => {
    const gameID = Number(req.query.gameID);
    let game = checkGame(gameID);
    res.status(200).send({numReviews: game.numReviews, totalScore: game.totalScore});
});
//Middleware for checking if user has submitted review for submitted game
app.get('/score', (req,res,next) =>{
    const gameID = Number(req.query.gameID);
    const username = req.query.username;
    const review = checkReview(username,gameID);
    if(review != null){res.status(200).send();}
    else {res.status(404).send();}
});
//Middleware for logging in user x with password z
app.post('/user', (req, res, next) => {
    const username = req.body.username;
    const user = checkUser(username);
    if(user === null){
        res.status(404).send();
    } else {
        let logPass = user.salt + req.body.password;
        logPass = hashFunc(logpass);
        if (user.password === logpass){
        const authToken = tokenGenerator(username);
        res.cookie('token', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          });
         
        res.status(200).send();
    } else {
        res.status(401).send();
    }
}
async function hashFunc(saltPass){
    return await bcrypt.hash(saltPass, 10);
}
});
//middleware for checking if a authtoken is valid
app.get('/user', (req, res, next) => {
    const token = req?.cookies.token;
    const name = checkAuth(token);
    if(name != null){
        res.status(200).send(JSON.stringify({username: name}));
    } else {
        res.status(401).send();
    }
});
function tokenGenerator(username){
    const uuid = String(crypto.randomUUID());
    tokens.insertOne({username: username, token: uuid});
    return uuid;
}
const port = 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
main().catch(console.error);