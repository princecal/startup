function submitReview(){
    const game = document.getElementById("").selectedIndex + 1;
    const score = document.getElementById("").selectedIndex;
    //insert login validation
    addScore(game,score);
    changeScore(game);
}
function run(){
    if(localStorage.getItem("1score") === null){
        localStorage.setItem("1score", 0);
    }
    if(localStorage.getItem("1review") === null){
        localStorage.setItem("1review", 0);
    }
    if(localStorage.getItem("2score") === null){
        localStorage.setItem("2score", 0);
    }
    if(localStorage.getItem("2review") === null){
        localStorage.setItem("2review", 0);
    }
    if(localStorage.getItem("3score") === null){
        localStorage.setItem("3score", 0);
    }
    if(localStorage.getItem("3review") === null){
        localStorage.setItem("3review", 0);
    }
    if(localStorage.getItem("4score") === null){
        localStorage.setItem("4score", 0);
    }
    if(localStorage.getItem("4review") === null){
        localStorage.setItem("4review", 0);
    }
    changeScore(1);
    changeScore(2);
    changeScore(3);
    changeScore(4);
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
    const childNode = document.createAttribute('p');
    const id = "message" + nextMessageNumber;
    childNode.setAttribute('id',id);
    childNode.textContent = x;
    parent.parentNode.appendChild(childNode);
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
    const score = localStorage.getItem(scoreid);
    const reviews = localStorage.getItem(reviewid);
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