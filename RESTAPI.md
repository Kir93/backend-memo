## 자주 사용하는 REST API

### 1. 기본 API

#### 1.1 DB 생성 시 기본적으로 생기는 API(ex. Post)

##### - GET backpath/posts

Find : Post 테이블의 모든 데이터 불러오기

##### - GET backpath/posts/:id

FindOne : Post 테이블에서 id가 Param과 동일한 데이터 불러오기

##### - GET backpath/posts/count

Count : Post 테이블의 모든 데이터의 갯수 불러오기

##### - POST backpath/posts

Create : Post 테이블에 새 데이터 생성

##### - DELETE backpath/posts/:id

Delete : Post 테이블에서 id가 Param과 동일한 데이터 제거

##### - PUT backpath/posts/:id

Put : Post 테이블에서 id가 Param과 동일한 데이터 수정

#### 1.2 Create API(ex. Post)

##### 1.2.1 api/post/config/routes.js 파일에서 원하는 API 만들기

ex. GET backpath/posts/geo?lat=123&lng=321


```
{
    "method": "GET",
    "path": "/posts/geo",
    "handler": "post.geo",
    "config": {
      "policies": []
    }
  },
```

##### 1.2.2 api/post/controllers/post.js에 추가한 handler의 이름과 동일한 API 만들기

```
module.exports = {
  geo: async (ctx) => {
    const result = await strapi.services.post.geo(ctx.query);
    return ctx.send(result);
  },
};
```

##### 1.2.3 api/post/services/post.js에 추가한 handler의 이름과 동일한 함수 만들기

```
module.exports = {
  geo: async (query) => {
    const { lat, lng } = query;
    const distanceInKmsSql = `(ABS(${lat} - lat) + ABS(${lng} - lng)) as distance`;
    const result = await strapi
      .query("post")
      .model.query((qb) => {
        qb.column([
          "id",
          "place",
          strapi.connections.default.raw(distanceInKmsSql),
        ]);
        qb.orderBy("distance");
        qb.where("id", ">", 2);
        qb.limit(10);
      })
      .fetchAll();
    return result;
  },
};
```

##### 1.2.4 그럼 DB에서 custom 내용을 불러올 수 있다.

```
[
  {
    "id":4,
    "place":"장군면",
    "distance":2801970.57714
  },
  {
    "id":5,
    "place":"의당전의로",
    "distance":2816691.020546},
  {
    "id":3,
    "place":"조치원읍",
    "distance":2825429.4743910003
  }
]
```
