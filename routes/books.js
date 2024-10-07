const express = require('express');
const router = express.Router();
router.use(express.json())
const { allBooks, bookDetail } = require("../controllers/bookController")
const conn = require("../mariadb")
const { StatusCodes } = require('http-status-codes');


router.get('/books', allBooks)

router.get('/books/:id', bookDetail)

//category 전체조회
router.get('/category', (req, res) => {
    sql = "SELECT * FROM category"
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" }).end()
        }
        res.status(StatusCodes.OK).json({ message: "Category retrieved", results })
    })
})

module.exports = router;
