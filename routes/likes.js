const express = require('express');
const router = express.Router();
router.use(express.json())
const { likePost, unlikePost } = require('../controllers/likeController') 

router.post('/likes/:id', likePost)

router.delete('/likes/:id', unlikePost)

module.exports = router;