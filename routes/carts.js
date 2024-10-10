const express = require('express');
const router = express.Router();
router.use(express.json())
const {addCart, getCart, deleteCart} = require("../controllers/cartController")

//장바구니 추가
router.post('/cart', addCart)

//장바구니 조회
router.get('/cart', getCart)

//장바구니 삭제
router.delete('/cart/:id', deleteCart)

//선택한 상품 장바구니에 조회
router.get('/carts', )

module.exports = router;