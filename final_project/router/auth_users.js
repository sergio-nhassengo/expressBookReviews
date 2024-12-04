const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("Checking token")

  const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {

  if (req.session.authorization) {

    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
        if (!err) {
          console.log(user)
            var review = {
              reviewer: req.session.authorization['username'],
              comment: req.body.comment
            }

            var book = books.find((book) => book.isbn == req.params.isbn);
            if (book) {
              book.reviews.push(review);
              return res.status(200).json(book);
            } else {
              return res.status(404).json({ message: "Book not found" });
            }

        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
} else {
    return res.status(403).json({ message: "User not logged in" });
}
});

//delete a book review
regd_users.delete("/review/:isbn", (req, res) => {

  if (req.session.authorization) {

    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
        if (!err) {

            var book = books.find((book) => book.isbn == req.params.isbn);
            if (book) {
              book.reviews = book.reviews.filter((review) => review.reviewer != req.session.authorization['username'])
              return res.status(200).json(book);
            } else {
              return res.status(404).json({ message: "Book not found" });
            }

        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
} else {
    return res.status(403).json({ message: "User not logged in" });
}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
