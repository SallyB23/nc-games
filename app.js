const express = require("express")
const { getCategories } = require("./controllers/categories.controller")
const { getUsers } = require("./controllers/users.controller")
const { getReviewById, patchReviewById, getReviews, getCommentsByReviewId, postCommentToReviewId } = require("./controllers/reviews.controller");
const { deleteCommentById } = require("./controllers/comments.controller")
const { handleCustomErrors, handlePSQLErrors, unhandledErrors } = require("./errors/error-handling");

const app = express()
app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)

app.get("/api/reviews/:review_id", getReviewById)
app.patch("/api/reviews/:review_id", patchReviewById)

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)
app.post("/api/reviews/:review_id/comments", postCommentToReviewId)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.get("*", (req, res) => {
    res.status(404).send({ message: "path not found"})
})

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(unhandledErrors)

module.exports = app;