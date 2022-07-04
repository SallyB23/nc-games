const db = require("../db/connection")

exports.fetchReviewById = id => {
    return db
    .query(
        'SELECT * FROM reviews WHERE review_id = $1', [id]
    )
    .then(({ rows }) => {
        if(rows.length !== 0){
            return rows[0] 
        } else {
            return Promise.reject({status: 404, message: "review_id not found"})
        }

    })
}