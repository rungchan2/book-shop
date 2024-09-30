const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const dotenv = require('dotenv');
dotenv.config();

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