const { checkExists } = require("../models/model-utils")
const { newCommentForReviewId, fetchReviewById, updateReviewById, fetchReviews, fetchCommentsByReviewId } = require("../models/reviews.model")

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params

    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(err => {
        next(err)
    })
}

exports.patchReviewById = (req, res, next) => {
    const { review_id } = req.params
    const updateInfo = req.body
    
    updateReviewById(review_id, updateInfo).then((review) => {
        res.status(200).send({ review })
    })
    .catch(err => {
        next(err)
    })
}

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params

    Promise.all([fetchCommentsByReviewId(review_id), checkExists("reviews", "review_id", review_id)]).then(([ comments ]) => {
        res.status(200).send({ comments })
    })
    .catch(err => {
        next(err)
    })
}

exports.postCommentToReviewId = (req, res) => {
    const { review_id } = req.params
    const newComment = req.body
    
    newCommentForReviewId(review_id, newComment).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getReviews = (req, res) => {
    fetchReviews().then((reviews) => {
        res.status(200).send({ reviews })
    })
}