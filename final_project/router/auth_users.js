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
  if(!username || !password) {
    return res.status(403).json({message: "This is a restricted area. Please register your account first"});
  }
  if(users.filter(user => user.username === username && user.password === password).length > 0) {
    let token = jwt.sign({
        data: username
    }, 'access', {expiresIn: 60*60});
    req.session.authorization = {token: token};
    return res.status(200).json({message: `Glad to see you again, ${username}`});
  }
  return res.status(404).json({message: "Wrong username and/or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;
  if(isbn in books) {
    const review = req.query.review;
    if(!review) {
        return res.status(400).json({message: "Review required"});
    }
    const oldReviews = books[isbn]["reviews"];
    if(username in oldReviews) {  
        oldReviews[username] = review;      
        return res.status(200).json({message: "Your previous review has been modified"});
    }
    oldReviews[username] = review;
    return res.status(200).json({message: "Your review has been added"});
  }
  return res.status(404).json({message: "No book was found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data;
    if(isbn in books) {
        if(username in books[isbn]["reviews"]) {
            delete books[isbn]["reviews"][username];
            return res.status(200).json({message: "Review successfully deleted"});
        }
        return res.status(404).json({message: "You haven't submitted any review"});
    }
    return res.status(404).json({message: "No book was found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
