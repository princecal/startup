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
