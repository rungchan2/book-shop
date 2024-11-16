const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const dotenv = require('dotenv');
dotenv.config();

// CORS 미들웨어 추가
app.use(cors({
  origin: 'http://localhost:3001', // 프론트엔드 주소
  credentials: true // 쿠키 사용 시 필요
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


const userRouter = require('./routes/users')
const bookRouter = require('./routes/books')
const orderRouter = require('./routes/orders')
const likeRouter = require('./routes/likes')
const cartRouter = require('./routes/carts')

app.use('/', userRouter)
app.use('/', bookRouter)
app.use('/', orderRouter)
app.use('/', likeRouter)
app.use('/', cartRouter) 