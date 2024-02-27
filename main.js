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
        showMessage(x);
    } else {
        //check login database, send needed message depending on pass/fail. If pass change welcome guest to welcome username, and add logout button
    }
}
function showLogout(){

}
function hideLogout(){

}
function register(){

}
let messageCount = 0;
let nextMessageNumber = 0;
function showMessage(x){
    const parent = document.getElementById("messages");
    const childNode = document.createElement("div");
    const text = document.createTextNode(x);
    childNode.appendChild(text);
    const id = "message" + nextMessageNumber;
    childNode.id = id;
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