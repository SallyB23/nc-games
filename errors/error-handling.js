const { checkExists } = require("../models/model-utils")

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({message: "Bad Request"})
    
    } else if (err.code === "23503") {
        if(err.detail.includes('table "reviews"')) {
            res.status(404).send({message: "Resource not found"})
        }
        if(err.detail.includes('table "users"')) {
            res.status(401).send({message: "Unauthorised"})
        }
        if(err.detail.includes('table "categories"')){
            res.status(404).send({message: "Category not found"})
        }
    } else if (err.code === "23505") {
        if(err.detail.includes("username")) {
            res.status(400).send({message: "That username already exists, please try another"})
        }
    } else {
        next(err)
    }
}

exports.unhandledErrors = (err, req, res, next) => {
    res.status(500).send({message: "Internal Server Error"})
}