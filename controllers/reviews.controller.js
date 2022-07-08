const {fetchReviewById, updateReviewById, fetchReviews, newReview} = require("../models/reviews.model")
const { checkExists } = require("../models/model-utils")

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
    const query = req.query
    const promises = [fetchReviews(query)]
    
    if (query.category !== undefined) {
        promises.push(checkExists("categories", "slug", query.category))
    }

    Promise.all(promises).then(([ reviews] ) => {
        res.status(200).send({ reviews })
    })
    .catch(err => {
        next(err)
    })
}

exports.postReview = (req, res, next) => {
    const newReviewInfo = req.body

    newReview(newReviewInfo).then((review) => {
        res.status(201).send({ review })
    })
    .catch(err => {
        next(err)
    })
}