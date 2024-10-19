const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken')
const decodeJwt = require('../utils/auth')

const order = async (req, res) => {

    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Book-shop',
        dateStrings: true
    })

    let authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" })
    } else {

        const userId = authorization.id

        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body


        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`
        let values = [delivery.address, delivery.receiver, delivery.contact]
        let [results] = await conn.execute(sql, values)

        let delivery_id = results.insertId


        sql = `INSERT INTO orders (delivery_id, total_price, total_quantity, user_id, book_title) VALUES (?, ?, ?, ?, ?);`
        values = [delivery_id, totalPrice, totalQuantity, userId, firstBookTitle]
        console.log(values)
        const [orderResults] = await conn.execute(sql, values);

        let order_id = orderResults.insertId

        //cartitem id 갖고 book_id, quantity 가져오기
        sql = `SELECT book_id, quantity FROM cartItems WHERE id in (?);`
        let [orderItems, fields] = await conn.query(sql, [items])

        sql = `INSERT INTO orderdBook (order_id, book_id, quantity) VALUES ?;`
        values = []
        orderItems.forEach(item => {
            values.push([order_id, item.book_id, item.quantity])
        })

        let finalResults = await conn.query(sql, [values])
        finalResults = finalResults[0]

        let deleteResults = deleteCartItem(conn, items)


        return res.status(StatusCodes.CREATED).json({
            message: "order created",
            order_id,
            delivery_id,
            finalResults,
            deleteResults
        })
    }
}

const deleteCartItem = async (conn, items) => {
    sql = `DELETE FROM cartItems WHERE id in (?);`

    let result = await conn.query(sql, [items])
    return result
}


const getOrders = (req, res) => {
    const authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." }).end()
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" }).end()
    }
    else {
        let sql = `SELECT * FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id;`
        conn.query(sql, (err, results) => {
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

const getOrderDetail = (req, res) => {
    const { id } = req.params
    const authorization = decodeJwt(res, req)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료 되었습니다." }).end()
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 토큰" }).end()
    }
    else {

        let sql = `SELECT * FROM orderdBook LEFT JOIN books ON orderdBook.book_id = books.id; WHERE order_id = ?;`
        conn.query(sql, [id], (err, results) => {
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


module.exports = {
    order,
    getOrders,
    getOrderDetail
}