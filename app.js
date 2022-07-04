const express = require("express")
const { getCategories } = require("./controllers/categories.controller")

const app = express()

app.get("/api/categories", getCategories);

app.get("*", (req, res) => {
    res.status(404).send({ error: "path not found"})
})

module.exports = app;