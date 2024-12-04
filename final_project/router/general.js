const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });

  try {
    const result = await booksPromise;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message }); 
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });

  try {
    const book = await booksPromise.find((book) => book.isbn == req.params.isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message }); 
  }

});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });

  try {
    const book = await booksPromise.find((book) => book.author == req.params.author);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message }); 
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });

  try {
    const book = await booksPromise.find((book) => book.title == req.params.title);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message }); 
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  var book = books.find((book) => book.isbn == req.params.isbn);
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
