const express = require('express');
const app = express();
app.use(express.static('public'));
const crypto = require('crypto');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 9900 });
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
    const document = await tokens.findOne({token: w});
    if(document){
        return document.username;
    } else {
        return null;
    }
}
async function checkGame(y){
    const document = await games.findOne({gameID: y});
    if(document){
        return document;
    } else {
        return null;
    }
}
//Middleware for registering x user with password z
app.post('/register', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if(await checkUser(username) === null){
        //FIXME Salt generation
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = salt + password;
        hashedPassword = await hashFunc(hashedPassword);
        users.insertOne({username: username, password: hashedPassword, salt: salt});
        const authToken = tokenGenerator(username);
        res.cookie('token', authToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          });
        res.status(200).send();
    }else {
        res.status(401).send();
    }
  });
//Middleware for submitting x users review score of game y
app.post('/score', async (req, res, next) => {
    const token = req?.cookies.token;
    const name = await checkAuth(token);
    if (name != null){
        const gameID = Number(req.body.gameID);
        const score = Number(req.body.score);
        reviews.insertOne({username: name, gameID: gameID, score: score});
        let game = await checkGame(gameID);
        const totalScore = game.totalScore + score;
        const numReviews = game.numReviews + 1;
        games.updateOne({gameID: gameID}, {$set: {totalScore: totalScore, numReviews: numReviews}});
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});
//Middleware for updating x users review score of game y
app.put('/score', async (req, res, next) => {
    const token = req?.cookies.token;
    const name = await checkAuth(token);
    if (name != null){
        const gameID = Number(req.body.gameID);
        const score = Number(req.body.score);
        let review = await checkReview(name,gameID);
        const totalScore = score - review.score;
        const finalScore = review.score + totalScore;
        reviews.updateOne({gameID: gameID, username: name},{$set: {score: finalScore}})
        let game = await checkGame(gameID);
        const gameScore = totalScore + game.totalScore;
        games.updateOne({gameID: gameID},{$set: {totalScore: gameScore}})
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
        tokens.findOneAndDelete({token: token});
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
app.get('/review', async (req, res, next) => {
    const gameID = Number(req.query.gameID);
    let game = await checkGame(gameID);
    res.status(200).send({numReviews: game.numReviews, totalScore: game.totalScore});
});
//Middleware for checking if user has submitted review for submitted game
app.get('/score', async (req,res,next) =>{
    const gameID = Number(req.query.gameID);
    const username = req.query.username;
    const review = await checkReview(username,gameID);
    if(review != null){res.status(200).send();}
    else {res.status(404).send();}
});
//Middleware for logging in user x with password z
app.post('/user', async (req, res, next) => {
    const username = req.body.username;
    const user = await checkUser(username);
    if(user === null){
        res.status(404).send();
    } else {
        let logPass = user.salt + req.body.password;
        if (await bcrypt.compare(logPass, user.password)){  
        const authToken = tokenGenerator(username);
        res.cookie('token',authToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          });
        res.status(200).send();
    } else {
        res.status(401).send();
    }
}
});
async function hashFunc(saltPass){
    return await bcrypt.hash(saltPass, 10);
}
//middleware for checking if a authtoken is valid
app.get('/user', async (req, res, next) => {
    const token = req?.cookies.token;
    const name = await checkAuth(token);
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
const server = app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
await main().catch(console.error);
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
  let connections = [];
  wss.on('connection', (ws) => {
    const connection = { id: crypto.randomUUID, alive: true, ws: ws };
    connections.push(connection);
    ws.on('message', function message(data) {
        connections.forEach((conn) => {
          if (conn.id != connection.id) {
            conn.ws.send(data);
          }
        });
      });
  });