function submitReview(){
    const game = document.getElementById("gameSelect").selectedIndex + 1;
    const score = document.getElementById("scoreSelect").selectedIndex;
    //insert login validation
    addScore(game,score);
    changeScore(game);
}
function run(){
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
        //check login database, send needed message depending on pass/fail.
        showMessage("Login Successful",'g');
        showLogout(username);
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
    //registers user, logs them in
    showLogout();
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
    showMessage("Logout Successful",'g')
    hideLogout();
}
function getAverage(x){
    const scoreid = x + "score";
    const reviewid = x + "review";
    const score = number(localStorage.getItem(scoreid));
    const reviews = number(localStorage.getItem(reviewid));
    if(reviews === 0){
        return 0;
    }
    return score/reviews;
}
function getDifference(x,y,z){
    //gets difference between a user x's old review of game y and new review with score z
}
function addScore(x,y){
    const scoreid = x + "score";
    const reviewid = x + "review";
    localStorage.setItem(scoreid,number(localStorage.setItemItem(scoreid)) + y);
    localStorage.setItem(reviewid,number(localStorage.setItemItem(reviewid)) + y);
    
}
function authCheck(x){
    //check validity of authtoken x
}