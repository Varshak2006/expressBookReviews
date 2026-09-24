const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get(
            'https://openlibrary.org/subjects/fiction.json?limit=10'
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books"
        });

    }

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `https://openlibrary.org/isbn/${isbn}.json`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`
        );

        return res.json(response.data.docs);

    } catch (error) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
        );

        return res.json(response.data.docs);

    } catch (error) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

});


// Get book review
public_users.get('/review/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        // The review data is maintained locally in booksdb.js
        if (books[isbn]) {
            return res.json(books[isbn].reviews);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving review"
        });

    }

});


module.exports.general = public_users;
