const db = require("../db/connection");

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
      if (rows.length !== 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, message: "review_id not found" });
      }
    });
};

exports.updateReviewById = (id, updateInfo) => {
  const updateArr = [updateInfo.inc_votes, id];
  return db
    .query(
      `UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *`,
      updateArr
    )
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, message: "review_id not found" });
      }
    });
};

exports.fetchReviews = () => {
    return db
    .query(
        `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
        return rows
    })
}
exports.fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE review_id = $1`,[id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchReviews = (query) => {
  const validSortOptions = [
    "created_at",
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "votes",
  ];

  let sortBy = "created_at";
  if (validSortOptions.includes(query.sort_by)) {
        sortBy = query.sort_by;
    }
      
  let orderBy = "desc";
  if (query.order === "asc") orderBy = "asc";

  let categoryArr = new Array();
  let whereStatement = "";
  if (query.category) {
    categoryArr.push(query.category);
    whereStatement = `WHERE category = $1`;
  }

  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::int AS comment_count FROM reviews
                LEFT JOIN comments ON comments.review_id = reviews.review_id
                ${whereStatement}
                GROUP BY reviews.review_id
                ORDER BY ${sortBy} ${orderBy}`, categoryArr
    )
    .then(({ rows }) => {
        return rows;
    });
};

exports.newCommentForReviewId = (id, newComment) => {
  const commentInfo = [newComment.body, id, newComment.username];
  return db
    .query(
      `INSERT INTO comments
        (body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING *`,
      commentInfo
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
