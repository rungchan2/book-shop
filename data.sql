INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2023-07-16");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2023-03-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2023-02-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2023-01-15");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2023-06-05");

// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs


Table users {
  id integer [primary key]
  email varchar
  password varchar
}

Table books {
  id integer [primary key]
  title varchar
  category_id integer
  format varchar
  isbn varchar
  summary text
  description text
  author varchar
  pages integer
  index text
  price integer
  likes integer
  pubDate datetime
}

Table cart {
  cart_id integer [pk]
  book_id integer
  user_id integer
  quantity integer 
}

Table likes {
  user_id integer
  liked_book_id integer
}

Table orders {
  order_id integer [pk]
  delivery_id integer
  total_price integer
  created_at datetime
}

table delivery {
  delivery_id integer [pk]
  address varchar
  receiver varchar
  contact varchar
}

table orderedBook {
  order_id integer 
  book_id integer
  count integer
  created_at datetime
}

table category {
  id integer [pk]
  name varchar
}



Ref: "likes"."user_id" < "users"."id"

Ref: "likes"."liked_book_id" < "books"."id"

Ref: "cart"."book_id" < "books"."id"

Ref: "orders"."delivery_id" < "delivery"."delivery_id"

Ref: "orderedBook"."book_id" < "books"."id"

Ref: "cart"."user_id" < "users"."id"

Ref: "orderedBook"."order_id" < "orders"."order_id"

Ref: "category"."id" < "books"."category_id"