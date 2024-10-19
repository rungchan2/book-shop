const conn = require("../mariadb")
const jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()
const decodeJwt = require('../utils/auth')

const likeBook = (req, res) => {

    const book_id = req.params.id

    let authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" })
    } else {
        const user_id = authorization.id

        let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES(?, ?)`

        conn.query(sql, [user_id, book_id], (err, result) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            } else {
                res.status(StatusCodes.CREATED).json({
                    message: "Book liked",
                    result
                })
            }
        })
    }
}


const unlikeBook = (req, res) => {

    const book_id = req.params.id
    const authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" })
    } else {
        const user_id = authorization.id

        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`

        conn.query(sql, [user_id, book_id], (err, result) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            } else {
                res.status(StatusCodes.OK).json({
                    message: "Book unliked",
                    result
                })
            }
        })
    }
}

module.exports = {
    likeBook,
    unlikeBook,
}