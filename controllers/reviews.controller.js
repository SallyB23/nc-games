const { fetchReviewById, updateReviewById, fetchReviews } = require("../models/reviews.model")

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

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch(err => {
        console.log(err)
    })
}