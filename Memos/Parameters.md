## [자주 사용하는 Parameters 정리](https://strapi.io/documentation/v3.x/content-api/parameters.html#available-operators)

### 1. Filters

주소 뒤에 붙일 시 _where의 쿼리가 되는 내용들 (ex. http://localhost:1337/posts?id_ne=1)

- eq : 아무것도 안 붙이면 자동으로 생성되며 같은 것을 불러옴
- ne : 같지 않은 것 불러옴
- lt : 내용보다 작은 것 불러옴
- lte : 내용보다 작거나 같은 것 불러옴
- gt : 내용보다 큰 것 불러옴
- gte : 내용보다 크거나 같은 것 불러옴
- in : 내용이 포함 된 배열을 불러옴
- nin : 내용이 포함되지 않은 배열을 불러옴
- contains(s) : 내용에 포함된(대소문자 구분) 것을 불러옴
- ncontains(s) : 내용에 포함되지 않은(대소문자 구분) 것을 불러옴
- null: 널이거나 아닌 것을 불러온

### 2. Examples

- /posts?id=1 or /posts?id_eq=1 : 포스트 테이블에서 id가 1인 데이터 불러옴
- /posts?id_ne=1 : 포스트 테이블에서 id가 1이 아닌 데이터 불러옴
- /posts?id_lt(lte, gt, gte)=3 : 포스트 테이블에서 id가 3보다 작은(작거나 같은, 큰, 크거나 같은) 데이터 불러옴
- /posts?id_in(nin)=3&id_in=6 : 포스트 테이블에서 id 3, 6인(아닌) 데이터 불러옴

### 3. Sort & Limit

- ASC: GET /users?_sort=email:ASC
- DESC: GET /users?_sort=email:DESC
- GET /users?_limit=30
- GET /users?_start=10&_limit=10

### 4. And / Or

- GET /posts?_where[0][stars]=1&_where[1][pricing_lte]=20 : AND
- GET /posts?_where[_or][0][stars]=1&_where[_or][1][pricing_gt]=30 : OR

