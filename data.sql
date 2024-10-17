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


SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(now(), INTERVAL 1 MONTH) AND now();



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




// likes

INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (3, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (4, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5);


SELECT count(*) FROM likes where liked_book_id = 1;

select *, (SELECT count(*) FROM likes where liked_book_id = 1;) AS likes from books;

SElect exists (SELECT * FROM likes where liked_book_id = 1 and user_id = 1);


//장바구니
INsert into cartItem (book_id, quantity, user_id) values(1,1,1);

//

SELECT cartItems.id book_id, title, summary , quantity, price FROM cartItems JOIN books ON cartItems.book_id = books.id WHERE user_id = 1;


SELECT * from cartItems Where user_id = 1 AND id in (1,3);

//배송정보 입력
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 강남구", "홍길동", "010-1234-5678");
INSERT INTO orders (delivery_id, total_price, created_at, user_id, book_title) VALUES ((SELECT max(id) FROM delivery), 20000, now(), 1, "해님달님");

//주문 상세 목록 입력
INSERT INTO orderdBook (order_id, book_id, quantity, created_at) VALUES ((SELECT max(id) FROM orders), 1, 1, now());

//카트 삭제
DELETE FROM cartItems WHERE id in (1,3,2);