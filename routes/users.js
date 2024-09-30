const express = require('express');
const router = express.Router();
router.use(express.json())

//signup
router.post('/signup', (req, res) => {})

//login
router.post('/login', (req, res) => {})


//reset pw request
router.route('/reset')
    .post((req, res) => {})
    .put((req, res) => {})


//update pw

module.exports = router;