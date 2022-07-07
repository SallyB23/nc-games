const { fetchEndpoints } = require("../models/api.models")

exports.getEndpoints = (req, res) => {
    fetchEndpoints().then((endpoints) => {
        const parsedEndpoints = JSON.parse(endpoints)
        res.status(200).send({ endpoints })
    })
}