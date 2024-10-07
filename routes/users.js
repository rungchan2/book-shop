const express = require('express');
const router = express.Router();
router.use(express.json())
const conn = require("../mariadb")
const {signup, login, requestPw, resetPw} = require("../controllers/userController")

//signup
router.post('/signup', signup)

//login
router.post('/login', login)


//reset pw request
router.route('/reset')
    .post(requestPw)
    .put(resetPw)


//update pw

module.exports = router;