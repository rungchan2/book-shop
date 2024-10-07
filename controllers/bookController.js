const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const crypto = require('crypto')


const allBooks = (req, res) => {

    const { category_id } = req.query

    if (category_id) {
        let sql_ca = `SELECT * FROM books WHERE category_id = ?`
        conn.query(sql_ca, [category_id], (err, results) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            }
            if (results[0]) {
                res.status(StatusCodes.OK).json({ message: "Books retrieved", results })
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Books not found" })
            }
        })
    } else {
        let sql = `SELECT * FROM books`
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
            } else {
                res.status(StatusCodes.OK).json({ message: "Books retrieved", results })
            }
        })
    }


}

const bookDetail = (req, res) => {

    let { id } = req.params
    id = parseInt(id)

    sql = `SELECT * from books WHERE id = ?`

    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" }).end()
        }

        if (results[0]) {
            res.status(StatusCodes.OK).json({ message: "Book retrieved", results })
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Book not found" })
        }
    })

}

module.exports = {
    allBooks,
    bookDetail,
}