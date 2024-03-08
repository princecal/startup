function submitReview(){
    const game = document.getElementById("gameSelect").selectedIndex + 1;
    const score = document.getElementById("scoreSelect").selectedIndex;
    const user = authCheck(localStorage.getItem("authToken"));
    if(user != null){
        const id = user + "review" + game;
        if(localStorage.getItem(id) != null){
            updateScore(game,getDifference(user,game,score));
            changeScore(game);
            showMessage("Your score has been updated.",'n');
        } else {
            addScore(game,score);
            changeScore(game);
        }
        localStorage.setItem(id,score);
    } else {
        showMessage("Unable to submit review without being logged in. Please log in and try again.",'r');
    }
}

function run(){
    if(localStorage.getItem("authToken") != null){
        const user = authCheck(localStorage.getItem("authToken"));
        if (user != null){
            showLogout(user);
        }
    }
    for(let i = 1; i < 5; i++){
        const scoreid = i + "score";
        const reviewid = i + "review";
        if(localStorage.getItem("scoreid") === null){
            localStorage.setItem("scoreid", 0);
        }
        if(localStorage.getItem("reviewid") === null){
            localStorage.setItem("reviewid", 0);
        }
        changeScore(i);
    }
    quote();
}
function changeScore(game){
    const average = parseFloat(getAverage(game).toFixed(1));
    const id = "game" + game;
    if(average >= 7){
        document.getElementById(id).className = "good";
     } else if(average >= 4){
         document.getElementById(id).className = "medium";
     } else {
         document.getElementById(id).className = "bad";
     }
     document.getElementById(id).textContent = average + "/10"
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
function register(){
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
        localStorage.setItem(username,password);
        tokenGenerator(username);
        showMessage("Login Successful",'g');
        showLogout(username);
    }
}
function tokenGenerator(username){
    const uuid = String(crypto.randomUUID());
    localStorage.setItem(uuid,username);
    localStorage.setItem("authToken", uuid);
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
function getAverage(x){
    const scoreid = x + "score";
    const reviewid = x + "review";
    const score = Number(localStorage.getItem(scoreid));
    const reviews = Number(localStorage.getItem(reviewid));
    if(reviews === 0){
        return 0;
    }
    return score/reviews;
}
function getDifference(x,y,z){
    const reviewid = x + "review" + y;
    const old = Number(localStorage.getItem(reviewid));
    return z - old;
    //gets difference between a user x's old review of game y and new review with score z
}
function addScore(x,y){
    const scoreid = x + "score";
    const reviewid = x + "review";
    localStorage.setItem(scoreid,Number(localStorage.getItem(scoreid)) + y);
    localStorage.setItem(reviewid,Number(localStorage.getItem(reviewid)) + 1);
    
}
function updateScore(x,y){
    const scoreid = x + "score";
    localStorage.setItem(scoreid,Number(localStorage.getItem(scoreid)) + y);
}
function authCheck(x){
    return localStorage.getItem(x);
    //check validity of authtoken x
}
function clear(){
    //Remove later
    localStorage.clear();
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