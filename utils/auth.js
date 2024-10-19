const jwt = require('jsonwebtoken')
require('dotenv').config()

const decodeJwt = (res, req)  => {
    try {
        let receivedJwt = req.headers['authorization']

        if (receivedJwt) {
            let decodedJwt = jwt.verify(receivedJwt, process.env.JWT_SECRET)
            return decodedJwt
        } else {
            throw new ReferenceError('no jwt') 
        }

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return error
    }
}


module.exports = decodeJwt