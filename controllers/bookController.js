const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()


const allBooks = (req, res) => {

    const { category_id, news, limit, currentPage } = req.query

    //limit -> 한 페이지에 보여줄 개수
    //currentPage -> 현재 페이지

    let offset = (currentPage - 1) * limit

    let sql = `SELECT *, (SELECT count(*) FROM likes where books.id = liked_book_id) AS likes FROM books`
    let values = []

    if (category_id && news) {
        sql += ` LEFT JOIN category ON books.category_id = category.id WHERE books.category_id = ? AND pub_date BETWEEN DATE_SUB(now(), INTERVAL 2 YEAR) AND now()`
        values.push(parseInt(category_id))
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(now(), INTERVAL 2 YEAR) AND now()`
    } else if (category_id) {
        sql += ` LEFT JOIN category on books.category_id = category.id WHERE category_id = ?`
        values.push(parseInt(category_id))
    }

    sql += ` LIMIT ? OFFSET ?`
    values.push(parseInt(limit), offset)

    console.log('values : ', values)

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" }).end()
        }
        if (results[0]) {
            return res.status(StatusCodes.OK).json({ message: "Books retrieved", results })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Books not found" })
        }
    })
}


const bookDetail = (req, res) => {

    let book_id = req.params.id
    let { user_id } = req.body

    book_id = parseInt(book_id)

    sql = `SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes, (SELECT exists (SELECT * FROM likes where liked_book_id = ? and user_id = ?)) AS liked from books LEFT JOIN category On books.category_id = category.category_id WHERE books.id = ?`

    let values = [book_id, user_id, book_id]

    conn.query(sql, values, (err, results) => {
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