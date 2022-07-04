const { fetchReviewById } = require("../models/reviews.model")

exports.getReviewById = (req, res) => {
    const { review_id } = req.params

    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })
}