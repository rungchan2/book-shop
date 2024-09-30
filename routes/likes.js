const express = require('express');
const router = express.Router();
router.use(express.json())

router.post('/likes/:id', (req, res) => {
    res.json(
        {
            message: "Liked"
        }
    )
})

router.delete('/likes/:id', (req, res) => {
    res.json(
        {
            message: "Unliked"
        }
    )
})

module.exports = router;