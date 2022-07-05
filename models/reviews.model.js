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

exports.fetchCommentsByReviewId = (id) => {
    return db
    .query(
        `SELECT * FROM comments
        WHERE review_id = $1`, [id]
        )
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchReviews = (query) => {
    const queries = Object.keys(query)
    const hasSortOrder = queries.includes("order")

    const validQueryOptions = ["sort_by", "category"]
    const validSortOptions = ["created_at", "review_id", "title", "category", "designer", "owner", "votes"]

    if (validQueryOptions.some(item => queries.includes(item)) || queries.length === 0 || hasSortOrder) {
        let sortBy = "created_at"
        if (queries.includes("sort_by")) sortBy = query.sort_by

        if (validSortOptions.includes(sortBy)) {
            return db
            .query(
                `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count FROM reviews
                LEFT JOIN comments ON comments.review_id = reviews.review_id
                GROUP BY reviews.review_id
                ORDER BY ${sortBy} DESC`
            )
            .then(({ rows }) => {
                return rows
            })
        } else {
            return Promise.reject({status: 400, message: "Bad Request"})
        }
    } else {
        return Promise.reject({status: 400, message: "Bad Request"})
    }
}

exports.newCommentForReviewId = (id, newComment) => {
    const commentInfo = [newComment.body, id, newComment.username]
    return db
    .query(
        `INSERT INTO comments
        (body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING *`, commentInfo
    )
    .then(({ rows }) => {
        return rows[0]
    })
}
