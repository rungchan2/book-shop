const express = require('express');
const router = express.Router();
router.use(express.json())
const { likeBook, unlikeBook } = require('../controllers/likeController') 

router.post('/likes/:id', likeBook)

router.delete('/likes/:id', unlikeBook)

module.exports = router;