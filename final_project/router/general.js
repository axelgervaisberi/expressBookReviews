const express = require("express");
const axios = require("axios");
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
  //Write your code here
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

// Get all the books
public_users.get("/books", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(404)
      .json({ message: "An error occured while fetching the books" });
  }
});

// Get book details based on ISBN
public_users.get("/books/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  return res.status(200).json(book);
});

public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `http://localhost:5000/books/isbn/${isbn}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while fetching the book" });
  }
});

// Get book details based on author
public_users.get("/books/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksByAuthor = Object.values(books).filter(
    (books) => books.author === author
  );
  return res.status(200).json(booksByAuthor);
});

public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  let author = req.params.author;
  try {
    const response = await axios.get(
      `http://localhost:5000/books/author/${author}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while fetching the book" });
  }
});

// Get all books based on title
public_users.get("/books/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = Object.values(books).filter(
    (books) => books.title === title
  );
  return res.status(200).json(booksByTitle);
});

public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  let title = req.params.title;
  try {
    const response = await axios.get(
      `http://localhost:5000/books/title/${title}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while fetching the book" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  } else if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res
      .status(404)
      .json({ message: "No reviews available for this book." });
  } else {
    return res.status(200).json(book.reviews);
  }
});

module.exports.general = public_users;
