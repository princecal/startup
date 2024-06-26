import React from 'react';
export default function App(){
    let socket;
    async function register(){
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        if(!username || !password){
            const x = "Either your Username or Password are not filled in. Please try again.";
            showMessage(x,'r');
        } else {
            try{
            const url = '/register';
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {'content-type': 'application/json'},
                  body: JSON.stringify({username: username, password: password}),
                });
                if(response.status === 200){
                    showMessage("Login Successful",'g');
                    showLogout(username);
                } else {
                    showMessage("Username already in use. Please try again with a different username.",'r');
                }
            }catch{
                showMessage("An error has occured.",'r');
            }
        }
    }
    async function login(){
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        if(!username || !password){
            const x = "Either your Username or Password are not filled in. Please try again.";
            showMessage(x,'r');
        } else {
            try{
                const url = '/user';
                    const response = await fetch(url, {
                      method: 'POST',
                      headers: {'content-type': 'application/json'},
                      body: JSON.stringify({username: username, password: password}),
                    });
                    if(response.status === 200){
                        showMessage("Login Successful",'g');
                        showLogout(username);
                    } else if(response.status === 404) {
                        showMessage("That username does not exist. Please try again.",'r');
                    } else {
                        showMessage("Incorrect Password. Please try again.",'r');
                    }
        }catch{
            showMessage("An error has occured.",'r');
        }
        }
    }
    async function logout(){
        //Logs out user, deletes auth token
        const url = '/user';
            const response = await fetch(url, {
              method: 'DELETE',
        });
        if(response.ok = true){
            showMessage("Logout Successful",'g')
            hideLogout();
        } else {
            showMessage("Logout Unsuccessful",'r')
        }
        
    }
    async function submitReview(){
    const game = document.getElementById("gameSelect").selectedIndex + 1;
    const score = document.getElementById("scoreSelect").selectedIndex;
    const user = await getUser();
    if(user != null){
        try{
         if(await getReview(user,game)){
            const url = '/score';
            const response = await fetch(url, {
              method: 'PUT',
              headers: {'content-type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({"gameID": game, "score": score}),
            });
            if(response.status === 200){
                changeScore(game);
                showMessage("Your score has been updated.",'n');
                const toCast = {
                    username: user,
                    gameID: game,
                    score: score,
                    type: "update",
                }
                broadcast(toCast);
            } else {
                showMessage("An error has occured.",'r');
            }
         } else {
            const url = '/score';
            const response = await fetch(url, {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({"gameID": game, "score": score}),
            });
            if(response.status === 200){
                changeScore(game);
                showMessage("Your review has been submitted.",'n');
                const toCast = {
                    username: user,
                    gameID: game,
                    score: score,
                    type: "submit",
                }
                broadcast(toCast);
            } else {
                showMessage("An error has occured.",'r');
            }
            
         }
        } catch{
            showMessage("An error has occured.",'r');
        }
    } else {
        showMessage("Unable to submit review without being logged in. Please log in and try again.",'r');
    }
}
async function getReview(user,game){
    try {
        const url = '/score?username=' + user + '&gameID=' + game;
        const response = await fetch(url, {
          method: 'GET',
        });
        if(response.ok === true){
            return true
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

async function run(){
    createSocket();
    const user = await getUser();
    if (user != null){
         showLogout(user);
    }
    for(let i = 1; i < 5; i++){
        await changeScore(i);
    }
    quote();
}
async function getUser(){
    try {
        const url = '/user';
        const response = await fetch(url, {
          method: 'GET',
          headers: {'content-type': 'application/json'},
          credentials: 'include',
        });
        const res = await response.json();
        if(response.status === 200){
            return res.username;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}
async function changeScore(game){
    try {
        const url = '/review?gameID=' + game;
        const response = await fetch(url, {
          method: 'GET',
          headers: {'content-type': 'application/json'},
        });
        const reviewScores = await response.json();
        let average = 0;
        if(reviewScores.numReviews != 0){average = parseFloat((reviewScores.totalScore / reviewScores.numReviews).toFixed(1));}
        const id = "game" + game;
        if(average >= 7){
            document.getElementById(id).className = "good";
        } else if(average >= 4){
            document.getElementById(id).className = "medium";
        } else {
            document.getElementById(id).className = "bad";
        }
        document.getElementById(id).textContent = average + "/10"
    } catch {
        showMessage("An error has occured displaying the score data.",'r');
    }
}
    async function quote(){
        const response = await fetch("https://www.amiiboapi.com/api/amiibo/?type=figure");
        const res = await response.json();
        const array = res.amiibo;
        const index = Math.floor(Math.random() * array.length)
        const amiibo = array[index];
        const text = "Random Amiibo Selection: " + amiibo.name + " from the " + amiibo.amiiboSeries + " amiibo series, which was released on " + amiibo.release.na;
        document.getElementById("api").textContent = text;
    }
    async function broadcast(toCast){
        socket.send(JSON.stringify(toCast));
    }
    async function createSocket(){
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        socket.onopen = (event) => {
            showMessage("Connected to server",'g');
        };
        socket.onclose = (event) => {
            showMessage("Disconnected from server, please reload the page",'r');
        };
        socket.onmessage = async (message) => {
            try{
            const fromWS = JSON.parse(await message.data.text());
            const url = '/game?gameID=' + fromWS.gameID;
            const response = await fetch(url);
            const res = await response.json();
            if(fromWS.type === "submit"){
                const toShow = "User " + fromWS.username + " has submitted a review for " + res.gameName + " with a score of " + fromWS.score + "/10";
                changeScore(fromWS.gameID);
                showMessage(toShow,'n');
            } else if (fromWS.type === "update"){
                const toShow = "User " + fromWS.username + " has updated their review for " + res.gameName + " with a score of " + fromWS.score + "/10";
                changeScore(fromWS.gameID);
                showMessage(toShow,'n');
            }
        } catch (e){
            console.log("websocket game name error");
        }
        }
    }
return (
  <><body onload = "run()">
    <header><h1>Welcome to Simplified Game Reviews!</h1></header>
  <main>
    <div className = "row">
        <div className = "left column" id = "messages"></div>
        <div className = "center column">
            <p><strong>Choose a game to rate! Ratings may only be submitted by registed users.</strong></p>
            <table>
                <tr>
                    <td>
                        <label for="select">Game to Rate: </label>
                        <select id="gameSelect" name="gameSelect">
                            <option>Pokemon Scarlet and Violet</option>
                            <option>Super Mario Bros. Wonder</option>
                            <option>The Legend of Zelda: Tears of the Kingdom</option>
                            <option>Lord of the Rings: Gollum</option>
                        </select>
                    </td>
                    <td>
                        <label for="select">Review Score: </label>
                        <select id="scoreSelect" name="scoreSelect">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </td>
                    <td>
                        <button id = "review" type="submit" className="btn btn-danger" onClick={submitReview()} disabled>Disabled</button>
                    </td>
                </tr>
            </table>
            <h2>Average Game Scores</h2>
        <table style="width:100%">
            <tr>
                <th className = "table_l">Game Logo</th>
                <th className = "table_c">Game Name</th>
                <th className = "table_r">Average Review Score</th>
            </tr>
            <tr>
                <td><img alt = "placeholder 1" src = "https://images.squarespace-cdn.com/content/v1/5cf4cfa4382ac0000123aa1b/1670600576642-EPGLG0E3G47HFLFHR9PN/Pokemon_TCG_Scarlet_Violet_Logo.png" width = "300px"/></td>
                <td>Pokemon Scarlet and Violet</td>
                <td id = "game1" className = "medium">6.8/10</td>
            </tr>
            <tr>
                <td><img height = "100px" alt = "placeholder 2" src = "https://upload.wikimedia.org/wikipedia/commons/3/36/Super_Mario_Bros._Wonder_Logo.png"/></td>
                <td>Super Mario Bros. Wonder</td>
                <td id = "game2" className = "good">9.0/10</td>
            </tr>
            <tr>
                <td><img height = "100px" alt = "placeholder 3" src = "https://i.redd.it/bwv58k96gnn91.png"/></td>
                <td>The Legend of Zelda: Tears of the Kingdom</td>
                <td id = "game3"  className = "good">9.5/10</td>
            </tr>
            <tr>
                <td><img height = "100px" alt = "placeholder 4" src = "data:image/jpeg;base64,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"/></td>
                <td>Lord of the Rings: Gollum</td>
                <td id = "game4" className ="bad">1.3/10</td>
            </tr>
        </table>
        </div>
        <div className = "right column">
            <h2 id = "welcome">Welcome Guest!</h2>
            <p>
                <label id = "userLabel" for="username">Username:</label> 
                <input type="username" id="username" placeholder="Enter Username"/>
            </p>
            <p>
                <label id = "passLabel" for="password">Password:</label>
                <input type="password" id="password" placeholder="Enter Password"/>
            </p>
            <div className = "rowButton">
                <button id = "login" type="submit" className ="btn btn-primary column button" onClick={login()}>Login</button>
                <button id = "register" type="submit" className = "btn btn-danger column button" onClick={register()}>Register</button>
            </div>
            <button hidden = {true} id = "logout" type="submit" className = "btn btn-danger column button" onClick={logout()}>Logout</button>
    
        </div>
    </div>
</main>
<footer>
    <div className = "column">
        <p id = "api">This is placeholder text. This will be replaced with facts about a random amiibo figure.</p>
        <p><a href="https://github.com/princecal/startup">Github Link</a> - Created by Corwyn Giles</p>
        <p>All copyrights belong to their original holders. Any use of copyrighted materials is for non-profit educational use only.</p>
    </div>
</footer>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script></>
);}