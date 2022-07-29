const { getUsers, getUserByUsername, postNewUser } = require("../controllers/users.controller")
const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUserByUsername)
usersRouter.post("/", postNewUser)

module.exports = usersRouter