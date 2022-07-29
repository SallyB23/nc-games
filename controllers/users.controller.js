const { fetchUsers, fetchUserByUsername, newUser } = require("../models/users.model")

exports.getUsers = (req, res) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params

    fetchUserByUsername(username).then((user) => {
        res.status(200).send({ user })
    })
    .catch(err => {
        next(err)
    })
}

exports.postNewUser = (req, res, next) => {
    const newUserInfo = req.body

    newUser(newUserInfo).then((user) => {
        res.status(201).send({ user })
    })
    .catch(err => {
        next(err)
    })
}