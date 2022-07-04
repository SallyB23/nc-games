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
    } else {
        next(err)
    }
}

exports.unhandledErrors = (err, req, res, next) => {
    res.status(500).send({message: "Internal Server Error"})
}