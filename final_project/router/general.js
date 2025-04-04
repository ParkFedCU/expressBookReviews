const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const theBooks = JSON.stringify(books);

public_users.post("/register", (req,res) => {
    const username = req.body.username;
	const password = req.body.password;
    var message = ""; var pushFlag = 0; var returnCode = 200;
    var aUser = {username:username,password:password}; 
    if(!password){pushFlag = 1; message = "password required ";returnCode = 300;}
    if(!username){pushFlag = 1; message += "username required";returnCode = 300;}   
    if(pushFlag === 0){
       for (var i in users) {
           if(users[i].username === username){message = "User already added";pushFlag = 1;} 
        }
        if(pushFlag === 0){
          users.push(aUser);
          message = username + " added.";
        }
    }
  return res.status(returnCode).json({message: message});
});

function getBooksFunction() {
  return  new Promise((resolve, reject) => {
    resolve(theBooks); //stringified version of the object
})
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooksFunction().then((result) => {
	return res.status(200).json({books: result});
    })
});

function getISBNFunction(theKey) {
  return  new Promise((resolve, reject) => {
       const foundKey = Object.keys(books).find(key => key === theKey);
       resolve(books[theKey]);
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //I assumed the key is the 'isbn' since it wasnt there
    //I also addded an isbn with the same value to query 
    const keyToFind = req.query.isbn;
     getISBNFunction(keyToFind).then((result) => {
	return res.status(200).json({books: result});
    })
 });
  
 function getAuthorFunction(author) {
    return  new Promise((resolve, reject) => {
        const keysArray = Object.keys(books);
        var foundElement = "";
        keysArray.find(element => {
            if (books[element].author === author) {
                foundElement += JSON.stringify(books[element]);
            }
        });
        resolve(foundElement); //stringified version of the object
  })
  }

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.query.author;
    getAuthorFunction(author).then((result) => {
        return res.status(200).json({books: result});
        })   
});

function getTitleFunction(title) {
    return  new Promise((resolve, reject) => {
        const keysArray = Object.keys(books);
        var foundElement = "";
        keysArray.find(element => {
            if (books[element].title === title) {
                foundElement += JSON.stringify(books[element]);
            }
        });

      resolve(foundElement); //stringified version of the object
  })
  }
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.query.title;
    getTitleFunction(title).then((result) => {
        return res.status(200).json({books: result});
        })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = Number(req.query.isbn);
    const keysArray = Object.keys(books);
    var foundElement = "";
    keysArray.find(element => {
        if (Number(books[element].isbn) === isbn) {
            foundElement += JSON.stringify(books[element].reviews);
        }
    });
    return res.status(200).json({book: foundElement});  
});




module.exports.general = public_users;
