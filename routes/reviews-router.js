const { getCommentsByReviewId, postCommentToReviewId } = require('../controllers/comments.controller')
const { getReviews, getReviewById, patchReviewById } = require('../controllers/reviews.controller')

const reviewsRouter = require('express').Router()

reviewsRouter.get("/", getReviews)
reviewsRouter
    .route("/:review_id")
    .get(getReviewById)
    .patch(patchReviewById)
reviewsRouter
    .route("/:review_id/comments")
    .get(getCommentsByReviewId)
    .post(postCommentToReviewId)

module.exports = reviewsRouter