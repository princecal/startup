function submitReview(){

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
function register(){

}
function showMessage(x){

}
function logout(){
    
}