## book-shop project

### 온라인에서 책을 판매하는 Ecommerce 플랫폼의 API 입니다.

1. book -> 책을 조회, 카테고리, 신간의 조건에 맞는 조회 가능
2. cart -> 로그인 한 유저를 대상으로 자신의 장바구니에 책 추가
3. like -> 책에 좋아요 누르기 및 좋아요 취소하기
4. order -> 장바구니에 담긴 것을 실제 주문하기 (주문시 배송지 정보, 주문한 상품에 새롭게 데이터를 삽입 후 장바구니 삭제)
5. user -> 로그인 및 회원가입 (토큰 발행과 함께)

--- 

### 사용한 페키지

1. jsonwebtoken
2. dotenv
3. http-status-codes
4. mysql2