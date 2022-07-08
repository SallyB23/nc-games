const { fetchUsers, fetchUserByUsername } = require("../models/users.model")

exports.getUsers = (req, res) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
}

exports.getUserByUsername = (req, res) => {
    const { username } = req.params

    fetchUserByUsername(username).then((user) => {
        res.status(200).send({ user })
    })
}