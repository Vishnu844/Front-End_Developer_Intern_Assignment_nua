/* eslint-disable no-undef */
// server.js
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/search", async (req, res) => {
  try {
    const { q, offset, limit } = req.query;
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${q}&fields=key,title,author_name,author_key,first_publish_year,subject,ratings_average&limit=${limit}&offset=${offset}`
    );
    res.json(response.data);
    console.log(q);
    console.log(offset);
    console.log(limit);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get("/authors", async (req, res) => {
  try {
    const authorName = req.query.q;
    // console.log(authorName);
    const response = await axios.get(
      `https://openlibrary.org/search/authors.json?q=${authorName}`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get("/author/:id", async (req, res) => {
  try {
    const authorKey = req.params.id;
    const response = await axios.get(
      `https://openlibrary.org/authors/${authorKey}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
