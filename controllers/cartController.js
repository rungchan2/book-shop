const conn = require("../mariadb")
const jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()
const decodeJwt = require('../utils/auth')


const addCart = (req, res) => {

    const { book_id, quantity } = req.body
    let authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" })
    } else {
        const user_id = authorization.id

        const sql = `INsert into cartItems (book_id, quantity, user_id) values(?,?,?);`
        const values = [book_id, quantity, user_id]

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            } else {
                res.status(StatusCodes.CREATED).json({
                    message: "cart created",
                    result
                })
            }

        })

    }
}


const getCart = (req, res) => {

    let { selected } = req.body

    const authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." }).end()
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" }).end()
    }
    else {
        let user_id = authorization.id
        console.log(user_id)

        sql = `SELECT cartItems.id book_id, title, summary , quantity, price FROM cartItems JOIN books ON cartItems.book_id = books.id WHERE user_id = ?;`
        let values = [user_id];

        if (selected) {
            sql += ` AND cartItems.id IN (?)`
            values.push(selected)
        }
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "bad request" })
            } else {
                res.status(StatusCodes.OK).json({
                    results
                })
            }

        })

    }
}

const deleteCart = (req, res) => {

    const { id } = req.params

    const authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." }).end()
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" }).end()
    }
    else {

        let sql = `DELETE FROM cartItems WHERE id = ?`

        conn.query(sql, [id], (err, results) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            } else {
                res.status(StatusCodes.OK).json({
                    message: "Item deleted",
                    results
                })
            }
        })
    }
}

module.exports = {
    addCart,
    getCart,
    deleteCart
}