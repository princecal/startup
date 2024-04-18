# startup

[Notes Page](https://github.com/princecal/startup/blob/main/notes.md)

## Startup Spec
### Elevator Pitch
Have you ever wanted to know what games are worth buying at a glance? The game review application will allow registered users to submit a score from zero to ten rating each of the listed games. The application will then average all of the scores and display them. This will allow users to quickly understand how generally liked a particular game is.
### Images
![mockup](https://github.com/princecal/startup/assets/89960425/011e1390-0d45-4841-971c-1058ef5a23f3)

### Key Features
* Secure Login
* Allows you to select which game to review
* Ability for admin to add games
* Results are persistently stored
* Ability to submit rating on a 0-10 scale
* Game Scores update in real time
### Technologies
**HTML** - Uses proper HTML structure. One HTML Page.  
**CSS** - Application styling will look good, score color will change depending on its value.  
**JavaScript** - provides login, game choice, submitting ratings, score updates, and endpoint calls.  
**Services** - Backend endpoints for login, voting, game choices, and vote tallying.  
**DB/Login** - Stores users, active auth tokens, games, and votes in a persistently stored database. Can't vote without a valid auth token.  
**Websocket** - When a user submits a rating the application will notify other users that the vote was made.  
**React** - The website will be ported to the React framework.  

## HTML Deliverable
For this deliverable, I built the frame of my application with HTML.   
**Text** - Added text showing each game, their name, and the rating assigned to them.  
**Images** - Added placeholder images for representing game logos.  
**Database/Login** - There are placeholders for each service call in rate and login.  
**3rd Party API** - Contains placeholder for an api call.  
**Websockets** - Contains placeholder for websocket implementation on the left column.  

## CSS Deliverable  
For this deliverable, I rebuilt my application to work with Flexbox and styled the application with CSS.  
### Prerequisites  
**Simon CSS** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### CSS Requirements  
**Header, Footer, and Main Content Body** - Styled Header, footer, and main body with proper CSS design. The footer is sticky to allow for a bigger main table.  
**Responsive Design** - Uses Flexbox to create a responsive design, and uses media queries for smaller screens.   
**Application Elements** - Application elements have been properly styled to stick out from the background, and buttons implement bootstrap buttons.  
**Application Text Content** - Text has been styled white to account for the dark mode design.  
**Images** - Are displayed in table format.  

## JavaScript Deliverable  
For this deliverable, I added JavaScript interaction to my application.  
### Prerequisites  
**Simon JavaScript** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### JavaScript Requirements  
**Javascript support for login** - Basic Login has been added. Application checks if username is already taken when registering, if the password is incorrect, or if either value in the form is blank.  
**Javascript support for database** - Database elements have been implemented temporarily using LocalStorage.  
**Javascript support for websocket** - On the left bar of the application, messages will show on successful or failed login or register attempts, more messages will be implemented as websockets are implemented.  
**Javascript support for interaction** - The application ensures that user is logged in to submit review, will properly get the correct score from database, and will update a users review score upon entering a score for a game they have already reviewed.  

## Services Deliverable  
For this deliverable, I added Services and API interactions to my application.  
### Prerequisites  
**Simon Service** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### JavaScript Requirements  
**Node and Express HTTP Service** - Complete  
**Static Middleware Frontend** - Complete  
**Third Party Service Call** - Complete  
**Backend Provides Service Endpoints** - Complete  
**Frontend Calls Service Endpoints** - Complete  

## Login Deliverable  
For this deliverable, I added Services and API interactions to my application.  
### Prerequisites  
**Simon Login** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### JavaScript Requirements  
**New User Registration** - New users have their information securely secured in Mongo, and then are given an authToken as a cookie.  
**Existing User Authentication** - Existing users can log in, and their password is salted and hashed with the same algorithm as it was originally, on match they are assigned a new authToken as a cookie.  
**Application Data in MongoDB** - Review data and game data are stored in Mongo, and new entries are entered or updated as necessary.  
**Credentials in MongoDB** - Credentials are salted, hashed, and then stored in MongoDB. On login, passwords are compared using bcrypt   
**Restricts Functionality based on Authentication** - Application does not let you submit a review without a valid authToken.  

## Websocket Deliverable  
For this deliverable, I added WebSocket interaction to my application.  
### Prerequisites  
**Simon Websocket** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### JavaScript Requirements  
**Backend listens for WebSocket connection** - The server is listening for any upgrade, message, or pong messages and uses an appropriate function to handle each.  
**Frontend makes WebSocket connection** - Upon opening the page, the frontend makes a connection to the server using WebSocket.  
**Data sent over WebSocket connection** - Upon making a successful review, data is sent out to all other active users letting them know that a review has been made.  
**WebSocket data displayed in the application interface** - Messages broadcasted through WebSocket are displayed on the left column.   

## React Deliverable  
For this deliverable, I added React to my application.  
### Prerequisites  
**Simon React** - Complete  
**Github Link** - Complete  
**Readme Update** - Complete  
**Git Commits** - Complete  
### JavaScript Requirements  
**Bundled using Vite** - Complete!  
**Multiple functional react components** - Not done  
**React router** - Not done  
**React hooks** - Not done  
