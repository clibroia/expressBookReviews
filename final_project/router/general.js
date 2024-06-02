const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
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
