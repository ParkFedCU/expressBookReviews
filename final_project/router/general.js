const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const theBooks = JSON.stringify(books);

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({books: theBooks});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //I assumed the key is the 'isbn'
    const keyToFind = req.query.isbn;
    const foundKey = Object.keys(books).find(key => key === keyToFind);
    return res.status(200).json({book: books[keyToFind]});     

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.query.author;
    const keysArray = Object.keys(books);
    var foundElement = "";
    keysArray.find(element => {
        if (books[element].author === author) {
            foundElement += JSON.stringify(books[element]);
        }
    });
    return res.status(200).json({book: foundElement});     
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.query.title;
    const keysArray = Object.keys(books);
    var foundElement = "";
    keysArray.find(element => {
        if (books[element].title === title) {
            foundElement += JSON.stringify(books[element]);
        }
    });
    return res.status(200).json({book: foundElement});  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
