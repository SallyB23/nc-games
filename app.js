const express = require("express")
const categoryRouter = require("./routes/category-router")
const reviewsRouter = require("./routes/reviews-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/users-router")
const { getEndpoints } = require("./controllers/api.controller")
const { handleCustomErrors, handlePSQLErrors, unhandledErrors } = require("./errors/error-handling");

const app = express()
app.use(express.json())

app.get("/api", getEndpoints)

app.use("/api/categories", categoryRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/comments", commentsRouter)
app.use("/api/users", usersRouter)

app.get("*", (req, res) => {
    res.status(404).send({ message: "path not found"})
})

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors)

module.exports = app;