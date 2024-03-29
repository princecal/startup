let socket;
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
function showLogout(x){
    document.getElementById("welcome").textContent = "Welcome " + x + "!";
    document.getElementById("username").hidden = true;
    document.getElementById("userLabel").hidden = true;
    document.getElementById("password").hidden = true;
    document.getElementById("passLabel").hidden = true;
    document.getElementById("login").hidden = true;
    document.getElementById("register").hidden = true;
    document.getElementById("logout").hidden = false;
}
function hideLogout(){
    document.getElementById("welcome").textContent = "Welcome Guest!";
    document.getElementById("username").hidden = false;
    document.getElementById("userLabel").hidden = false;
    document.getElementById("password").hidden = false;
    document.getElementById("passLabel").hidden = false;
    document.getElementById("login").hidden = false;
    document.getElementById("register").hidden = false;
    document.getElementById("logout").hidden = true;
}
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
let messageCount = 0;
let nextMessageNumber = 0;
function showMessage(x,y){
    const parent = document.getElementById("messages");
    const childNode = document.createElement("div");
    const text = document.createTextNode(x);
    childNode.appendChild(text);
    const id = "message" + nextMessageNumber;
    childNode.id = id;
    switch (y) {
        case 'r':
            childNode.style.color = "red";
            break;
        case 'g':
            childNode.style.color = "green";
            break; 
    }
    parent.appendChild(childNode);
    messageCount++;
    nextMessageNumber++;
    if (nextMessageNumber > 4){
        nextMessageNumber = 0;
    }
    if(messageCount > 4){
        const idToDelete = "message" + nextMessageNumber
        var toDelete = document.getElementById(idToDelete);
        toDelete.remove();
        messageCount--;
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
        const res = await response.json();
        const response = await fetch(url);
        if(fromWS.type === "submit"){
            const toShow = "User " + fromWS.name + " has submitted a review for " + res.gameName + " with a score of " + fromWS.score + "/10";
            showMessage(toShow,'n');
        } else if (fromWS.type === "update"){
            const toShow = "User " + fromWS.name + " has updated their review for " + res.gameName + " with a score of " + fromWS.score + "/10";
            showMessage(toShow,'n');
        }
    } catch (e){
        console.log("websocket game name error");
    }
    }
}