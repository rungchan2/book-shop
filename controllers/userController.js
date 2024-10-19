const conn = require("../mariadb")
const { StatusCodes } = require("http-status-codes")
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const crypto = require('crypto')


const createEmailChain = () => body('email').notEmpty().isEmail().withMessage('email must be email')
const createPasswordChain = () => body('password').notEmpty().isString().withMessage('password must be string')
const createNameChain = () => body('name').notEmpty().isString().withMessage('name must be string')
const createContactChain = () => body('contact').notEmpty().isString().withMessage('contact must be string')

const signup = (req, res) => {
    const { email, password } = req.body

    const sql = `INSERT INTO users (email, password, salt) VALUES(?,?,?)`

    const salt = crypto.randomBytes(10).toString('base64')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 10, 'sha512').toString('base64')

    const values = [email, hashedPassword, salt]

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })
        } else {
            res.status(StatusCodes.CREATED).json({
                message: "User created",
                result
            })
        }

    })
}
const login = (req, res) => {

    const { email, password } = req.body
    
    conn.query(`SELECT * FROM users WHERE email = ?`, [email],
        function (err, results) {

            loginUser = results[0]

            const hashedPassword = crypto.pbkdf2Sync(password, loginUser.salt || "sdf", 100000, 10, 'sha512').toString('base64')

            if (loginUser && loginUser.password === hashedPassword) {

                const token = jwt.sign({
                    id: loginUser.id,
                    email: loginUser.email,
                    issuer: 'bookstore'
                }, process.env.JWT_SECRET, { expiresIn: '24h' })

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none'
                })

                res.status(StatusCodes.OK).json({
                    message: 'Login success',
                    results
                })

            } else if (loginUser && loginUser.password !== hashedPassword) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Password is incorrect',
                })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'User not found'
                })
            }
        }
    )


}

const requestPw = (req, res) => {
    const { email } = req.body

    conn.query(`SELECT * FROM users WHERE email = ?`, email,
        function (err, results) {

            if (err) {
                console.log(err)
                res.status(StatusCodes.BAD_REQUEST).end()
            }
            const user = results[0]

            if (!user) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
                return
            } else {
                res.status(StatusCodes.OK).json({
                    message: "Email sent",
                    email: email
                })
            }

        }
    )
}

const resetPw = (req, res) => {
    const { email, password } = req.body

    const salt = crypto.randomBytes(10).toString('base64')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 10, 'sha512').toString('base64')

    conn.query(`UPDATE users SET password = ?, salt=? WHERE email = ?`, [hashedPassword, salt, email],
        function (err, results) {
            if (err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).json(err).end()
            }

            if (results.affectedRows === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" }).end()
            } else {
                res.status(StatusCodes.OK).json({ message: "Password updated" })
            }
        }
    )
}



module.exports = { signup, resetPw, requestPw, login };