const express = require('express');
const router = express.Router();
router.use(express.json())

router.get('/books', (req, res) => {
    res.json(
        {
            message: "Book created"
        }
    )
})

router.get('/books/:id', (req, res) => {
    res.json(
        {
            message: "Book updated"
        }
    )
})

router.get('/books', (req, res) => {
    const { category, isNew } = req.params 
    res.json(
        {
            message: "Book deleted"
        }
    )
})

module.exports = router;
