const { getCommentsByReviewId, postCommentToReviewId } = require('../controllers/comments.controller')
const { getReviews, getReviewById, patchReviewById, postReview } = require('../controllers/reviews.controller')

const reviewsRouter = require('express').Router()

reviewsRouter
    .route("/")
    .get(getReviews)
    .post(postReview)
reviewsRouter
    .route("/:review_id")
    .get(getReviewById)
    .patch(patchReviewById)
reviewsRouter
    .route("/:review_id/comments")
    .get(getCommentsByReviewId)
    .post(postCommentToReviewId)

module.exports = reviewsRouter