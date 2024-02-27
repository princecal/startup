function submitReview(){
    const game = document.getElementById("").selectedIndex + 1;
    const score = document.getElementById("").selectedIndex;
    //insert login validation
    //insert adding score to database
    const average = parseFloat(getAverage(game).toFixed(1));
    const id = "game" + game;
    changeScore(average,id);
}
function changeScore(average,id){
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
    //gets average for x games scores.
}
function getDifference(x,y,z){
    //gets difference between a user x's old review of game y and new review with score z
}
function addScore(x,y){
    //adds x score to game y
}
function authCheck(x){
    //check validity of authtoken x
}