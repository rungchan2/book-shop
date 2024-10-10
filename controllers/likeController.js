const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()


const likePost = (req, res) => {
    
    const { id } = req.params
    const { user_id } = req.body

    let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES(?, ?)`

    conn.query(sql, [user_id, id], (err, result) => {
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


const unlikePost = (req, res) => {
    const { id } = req.params
    const { user_id } = req.body

    let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`

    conn.query(sql, [user_id, id], (err, result) => {
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

module.exports = {
    likePost,
    unlikePost,
}