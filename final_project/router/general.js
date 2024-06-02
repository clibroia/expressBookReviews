const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username === "" || password === "") {
    return res.status(400).json({message: "You must provide both a username and a password"});
  }
  if(users.includes(username)) {
    return res.status(409).json({message: "Username already in use"});
  }
  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully created"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books));
});
// Asynchronous version
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("https://api.example.com/books");
        res.status(200).json({message: response.data});
    }
    catch(error) {
        console.error("Error fetching books: "+ error);
        res.status(500).json({errorMessage: "Error fetching books"});
    }
}); 

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if(isbn in books) {
    return res.send({
        isbn: isbn,
        ...books[isbn]
    });
  }
  return res.status(404).json({message: "Book not found"});
 });
 // Asynchronous version
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get("https://api.example.com/books");
        const books = response.data;
        const isbn = parseInt(req.params.isbn);
        if(isbn in books) {
            return res.send({
                    isbn: isbn,
                    ...books[isbn]
            });
        }
        return res.status(404).json({message: "Book not found"});
    }
    catch(error) {
        console.error("Error fetching books: "+ error);
        res.status(500).json({errorMessage: "Error fetching books"});
    }
}); 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authorbooks = [];
  for(const isbn in books) {
    if(books[isbn]["author"] === author) {
        authorbooks.push({isbn: isbn, ...books[isbn]});
    }
  }
  if(authorbooks.length > 0) {
    return res.send(authorbooks);
  }
  return res.status(404).json({message: "No books of the requested author"});
});
 // Asynchronous version
 public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get("https://api.example.com/books");
        const books = response.data;
        const author = req.params.author;
        let authorbooks = [];
        for(const isbn in books) {
            if(books[isbn]["author"] === author) {
                authorbooks.push({isbn: isbn, ...books[isbn]});
            }
        }
        if(authorbooks.length > 0) {
            return res.send(authorbooks);
        }
        return res.status(404).json({message: "No books of the requested author"});
    }
    catch(error) {
        console.error("Error fetching books: "+ error);
        res.status(500).json({errorMessage: "Error fetching books"});
    }
}); 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titlebooks = [];
  for(const isbn in books) {
    if(books[isbn]["title"] === title) {
        titlebooks.push({isbn: isbn, ...books[isbn]});
    }
  }
  if(titlebooks.length > 0) {
    return res.send(titlebooks);
  }
  return res.status(404).json({message: "No book with the requested title found"});
});
 // Asynchronous version
 public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get("https://api.example.com/books");
        const books = response.data;
        const title = req.params.title;
        let titlebooks = [];
        for(const isbn in books) {
            if(books[isbn]["title"] === title) {
                titlebooks.push({isbn: isbn, ...books[isbn]});
            }
        }
        if(titlebooks.length > 0) {
            return res.send(titlebooks);
        }
        return res.status(404).json({message: "No book with the requested title found"});
    }
    catch(error) {
        console.error("Error fetching books: "+ error);
        res.status(500).json({errorMessage: "Error fetching books"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if(isbn in books) {
    const reviews = books[isbn]["reviews"];
    if(JSON.stringify(reviews) === "{}") {
        return res.send("There isn't any review yet");
    }
    return res.send(books[isbn]["reviews"]);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
