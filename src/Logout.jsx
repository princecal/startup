import React from 'react';
export function Logout(){
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
return(<>
<h2 id = "welcome">Welcome Guest!</h2>
<button hidden = {true} id = "logout" type="submit" className = "btn btn-danger column button" 
onclick="logout()">Logout</button></>);}