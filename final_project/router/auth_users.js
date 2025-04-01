const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
	const password = req.body.password;
    var userOK = 0; 
    var pwOK = 0;
    var message = "";
    var pushFlag = 0;
    var returnCode = 200;
    if (!username) {message = "username empty"; pushFlag = 1; returnCode = 300;}
    if (!password) {message = "password empty";pushFlag = 1; returnCode = 300;}
    
    if(pushFlag === 0)
    {
        for (var i in users) {
           if(users[i].username === username && users[i].password === password){userOK = 1;} 
        }
         // Generate JWT access token
        let accessToken = jwt.sign({
            data: username, password
        }, 'access', { expiresIn: 60 * 60 });

         // Store access token in session
         req.session.authorization = {
           accessToken
        }
        message += accessToken.toString();
    }
    return res.status(returnCode).json({message: message});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
