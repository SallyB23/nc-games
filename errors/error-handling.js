exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.message) {
        console.log(err)
        res.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({message: "invalid input"})
    }
}

exports.unhandledErrors = (err, req, res, next) => {
    res.status(500).send({message: "Internal Server Error"})
}