const db = require("../db/connection")

exports.fetchUsers = () => {
    return db
    .query('SELECT * FROM users')
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    return db
    .query(`
        SELECT * FROM users
        WHERE username = $1`, [username]
    )
    .then(({ rows }) => {
        if (rows.length !== 0) {
           return rows[0] 
        } else {
            return Promise.reject({status: 404, message: "username not found"})
        }
    })
}

exports.newUser = (newUser) => {
    const userInfo = [newUser.username, newUser.avatar_url, newUser.name]
    return db
      .query(
        `INSERT INTO users
        (username, avatar_url, name)
        VALUES ($1, $2, $3)
        RETURNING *`, userInfo
      )
      .then(({ rows }) => {
        return rows[0]
      })
}