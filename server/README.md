# server.js:
### 7-12-24
- implemented the routes for the users, posts, and comments
- tested the routes with postman and verified correct functionality

### 7-10-24
- implemented the register and login routes for authentication
    - tested the routes to be connected with MongoDB database
    - new queries go under the test document
- used jwt (json web token) for verifying user (not yet tested)
- added the authentication route into server.js. Other routes to be implemented later

### 7-7-24
- added password hashing middleware using the bcrypt library for more secure authentication

### 7-4-24
- define a new structure where the parts that are separate from server.js are: database connection, models, routes
    - doing so helps with modularity and code organization

### 6-27-24
- connects to the MongoDB database
- if successful, should print out a console log saying "MongoDB connected"
- runs the server on port 5000