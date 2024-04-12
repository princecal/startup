
return(<><h2 id = "welcome">Welcome Guest!</h2>
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
</div></>);