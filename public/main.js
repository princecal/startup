async function submitReview(){
    const game = document.getElementById("gameSelect").selectedIndex + 1;
    const score = document.getElementById("scoreSelect").selectedIndex;
    const user = getUser(localStorage.getItem("authToken"));
    if(user != null){
        try{
         if(getReview(user,game)){
            url = '/score';
            const response = await fetch(url, {
              method: 'PUT',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify({"token": localStorage.getItem("authToken"), "gameID": game, "score": score}),
            });
            const res = await response.json();
            if(response.status === 200){
                changeScore(game);
                showMessage("Your score has been updated.",'n');
            } else {
                showMessage("An error has occured.",'r');
            }
         } else {
            url = '/score';
            const response = await fetch(url, {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify({"token": localStorage.getItem("authToken"), "gameID": game, "score": score}),
            });
            const res = await response.json();
            if(response.status === 200){
                changeScore(game);
                showMessage("Your review has been submitted.",'n');
            } else {
                showMessage("An error has occured.",'r');
            }
            
         }
         localStorage.setItem(id,score);
        } catch{
            showMessage("An error has occured.",'r');
        }
    } else {
        showMessage("Unable to submit review without being logged in. Please log in and try again.",'r');
    }
}
async function getReview(user,game){
    try {
        url = '/score?username=' + user + '&gameID=' + game;
        const response = await fetch(url, {
          method: 'GET',
          headers: {'content-type': 'application/json'},
        });
        const res = await response.json();
        if(res.status === 200){
            return true
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

function run(){
    if(localStorage.getItem("authToken") != null){
        const user = getUser(localStorage.getItem("authToken"));
        if (user != null){
            showLogout(user);
        }
    }
    for(let i = 1; i < 5; i++){
        changeScore(i);
    }
    quote();
}
async function getUser(token){
    try {
        url = '/user?token=' + token;
        const response = await fetch(url, {
          method: 'GET',
          headers: {'content-type': 'application/json'},
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
        url = '/review?gameID=' + game;
        const response = await fetch(url, {
          method: 'GET',
          headers: {'content-type': 'application/json'},
        });
        const reviewScores = await response.json();
        const average = parseFloat((reviewScores.totalScores / reviewScores.numReviews).toFixed(1));
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
function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    if(!username || !password){
        const x = "Either your Username or Password are not filled in. Please try again.";
        showMessage(x,'r');
    } else {
        const dataPass = localStorage.getItem(username);
        if(dataPass === null){
            showMessage("That username does not exist. Please try again.",'r');
        } else if(dataPass === password){
            tokenGenerator(username);
            showMessage("Login Successful",'g');
            showLogout(username);
        } else {
            showMessage("Incorrect Password. Please try again.",'r');
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
    } else if (localStorage.getItem(username) != null) {
        showMessage("Username already in use. Please try again with a different username.",'r');
    } else {
        try{
        url = '/register';
            const response = await fetch(url, {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify({username: username, password: password}),
            });
            const res = await response.json();
            if(response.status === 200){
                localStorage.setItem("authToken", res.token);
                showMessage("Login Successful",'g');
                showLogout(username);
            } else {
                showMessage("Username already in use. Please try again with a different username.",'r');
            }
        }
        catch{
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
function logout(){
    //Logs out user, deletes auth token
    const token = localStorage.getItem("authToken");
    localStorage.removeItem(token);
    localStorage.removeItem("authToken");
    showMessage("Logout Successful",'g')
    hideLogout();
}
function quote(){
    try{
        const r = fetch('https://ultima.rest/api/random')
        const j = r.json();
        const quote = j.getItem("quote");
        const character = j.getItem("character");
        const title = j.getItem("title");
        console.log(j);
    } catch {

    }
    
}