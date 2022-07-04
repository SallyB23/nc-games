const db = require("../db/connection")

exports.fetchReviewById = (id) => {
    return db
    .query(
        `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count 
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`, [id]
    )
    .then(({ rows }) => {
        if(rows.length !== 0){
            return rows[0] 
        } else {
            return Promise.reject({status: 404, message: "review_id not found"})
        }

    })
}

exports.updateReviewById = (id, updateInfo) => {
    const updateArr = [updateInfo.inc_votes, id]
    return db
    .query(
        `UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *`, updateArr
    )
    .then(({ rows }) => {
        if(rows.length !== 0){
            return rows[0] 
        } else {
            return Promise.reject({status: 404, message: "review_id not found"})
        }
    })
}