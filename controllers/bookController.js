const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const decodeJwt = require('../utils/auth')


const allBooks = (req, res) => {

    let distance = '1 MONTH'

    let allBooksRes = {}

    let { category_id, news, limit, currentPage } = req.query

    currentPage = parseInt(currentPage)

    //limit -> 한 페이지에 보여줄 개수
    //currentPage -> 현재 페이지

    let offset = (currentPage - 1) * limit

    let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes where books.id = liked_book_id) AS likes FROM books`
    let values = []

    if (category_id && news) {
        sql += ` LEFT JOIN category ON books.category_id = category.category_id WHERE books.category_id = ? AND pub_date BETWEEN DATE_SUB(now(), INTERVAL ${distance}) AND now()`
        values.push(parseInt(category_id))
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(now(), INTERVAL ${distance}) AND now()`
    } else if (category_id) {
        sql += ` LEFT JOIN category on books.category_id = category.category_id WHERE books.category_id = ?`
        values.push(parseInt(category_id))
    }

    sql += ` LIMIT ? OFFSET ?;`
    values.push(parseInt(limit), offset)

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" }).end()
        }
        
        results.map(result => {
            result.pubDate = result.pub_date;
            delete result.pub_date;
        })
        allBooksRes.books = results;

        conn.query(`SELECT found_rows();`, (err, countResults) => {
            if (err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end()
            }
            
            let pagination = {};
            pagination.totalCount = countResults[0]['found_rows()']
            pagination.currentPage = currentPage
            
            allBooksRes.pagination = pagination
            
            return res.status(StatusCodes.OK).json(allBooksRes).end()
        })
    })

}


const bookDetail = (req, res) => {

    let book_id = parseInt(req.params.id)
    let authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" })
    } else if (authorization instanceof ReferenceError) {

        sql = `SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes from books LEFT JOIN category On books.category_id = category.category_id WHERE books.id = ?`

        let values = [book_id]

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

    } else {
        let user_id = authorization.id

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
}

module.exports = {
    allBooks,
    bookDetail,
}