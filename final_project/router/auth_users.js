const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  
  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username or password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // ISBN aus der Route
  const review = req.body.review; // Rezension aus dem Request-Body
  const username = req.session.authorization.username; // Benutzername aus der Session

  if (!username) {
    return res.status(401).send("User is not logged in.");
  }

  if (!books[isbn]) {
    return res.status(404).send("Book not found!");
  }

  if (!review) {
    return res.status(400).send("Review content is required.");
  }

  // Sicherstellen, dass das 'reviews'-Objekt existiert
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Benutzerrezension hinzufügen oder aktualisieren
  books[isbn].reviews[username] = review;

  res.send({
    message: `Review by ${username} for book with ISBN ${isbn} has been added/updated.`,
    reviews: books[isbn].reviews // Alle aktuellen Rezensionen zurückgeben
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!username) {
    return res.status(401).send("User is not logged in.");
  }

  if (!books[isbn]) {
    return res.status(404).send("Book not found!");
  }

  books = Object.values(books).filter(books => books.isbn === isbn);

  res.send(`Reviews from User ${username} deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
