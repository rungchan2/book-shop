const express = require('express');
const router = express.Router();
router.use(express.json())

//장바구니 추가
router.post('/cart', (req, res) => {
    res.json(
        {
            message: "Cart added"
        }
    )
})

//장바구니 조회
router.get('/cart', (req, res) => {
    res.json(
        {
            message: "cart retrieved"
        }
    )
})

//장바구니 삭제
router.delete('/cart/:id', (req, res) => {
    res.json(
        {
            message: "book deleted"
        }
    )
})

//선택한 상품 장바구니에 조회
router.get('/carts', (req, res) => {
    res.json(
        {
            message: "cart retrieved"
        }
    )
})

module.exports = router;