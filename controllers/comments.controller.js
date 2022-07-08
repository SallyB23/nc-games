const { checkExists } = require("../models/model-utils")
const { fetchCommentsByReviewId, newCommentForReviewId, removeCommentById, updateComment } = require("../models/comments.model")

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params

    Promise.all([fetchCommentsByReviewId(review_id), checkExists("reviews", "review_id", review_id)]).then(([ comments ]) => {
        res.status(200).send({ comments })
    })
    .catch(err => {
        next(err)
    })
}

exports.postCommentToReviewId = (req, res, next) => {
    const { review_id } = req.params
    const newComment = req.body
    
    newCommentForReviewId(review_id, newComment).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(err => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params

    removeCommentById(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params
    const updateInfo = req.body
    
    updateComment(comment_id, updateInfo).then((comment) => {
        res.status(200).send({ comment })
    })
    .catch(err => {
        next(err)
    })
}