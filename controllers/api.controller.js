const { fetchEndpoints } = require("../models/api.models")

exports.getEndpoints = (req, res, next) => {
    fetchEndpoints().then((endpoints) => {
        res.status(200).send({ endpoints })
    })
    .catch(err => {
        console.log(err, "<<err")
    })
}