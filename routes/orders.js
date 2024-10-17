const express = require('express');
const router = express.Router();
router.use(express.json())
const {order, getOrders, getOrderDetail} = require("../controllers/orderController")

//주문 하기
router.post('/orders', order)
//주문 목록 조회
router.get('/orders', getOrders)
//주문 상세 상품 조회
router.get('/orders/:id', getOrderDetail)

module.exports = router;