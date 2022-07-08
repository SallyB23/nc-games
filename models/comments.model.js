const db = require("../db/connection")

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

exports.removeCommentById = (id) => {
    return db
    .query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`, [id]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, message: "comment_id not found"})
        }
    })
}

exports.updateComment = (id, updateInfo) => {
    const updateArr = [updateInfo.inc_votes, id];
    return db
      .query(
        `UPDATE comments
          SET votes = votes + $1
          WHERE comment_id = $2
          RETURNING *`, updateArr
      )
      .then(({ rows }) => {
        if (rows.length !== 0) {
          return rows[0];
        } else {
          return Promise.reject({ status: 404, message: "comment_id not found" });
        }
      });
}
