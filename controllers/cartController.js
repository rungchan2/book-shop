const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
require('dotenv').config()


const addCart = (req, res) => {

    const { user_id, book_id, quantity } = req.body
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


const getCart = (req, res) => {

    const {user_id, selected} = req.body

    const sql = `SELECT cartItems.id book_id, title, summary , quantity, price 
                    FROM cartItems 
                    JOIN books ON cartItems.book_id = books.id 
                    WHERE user_id = ? AND cartItems.id IN (?);`

    conn.query(sql, [user_id, selected], (err, results) => {
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

const deleteCart = (req, res) => {

    const { id } = req.params

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

module.exports = {
    addCart,
    getCart,
    deleteCart
}