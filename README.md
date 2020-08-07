# StrapiMemo

Strapi Memo

### 1. [New Auth Provider](https://strapi.io/documentation/v3.x/plugins/users-permissions.html#user-object-in-strapi-context)

- WEB 소셜 로그인 접속 주소

```
http://localhost:1337/connect/Any Provider Name
```

- WEB이 아닌 RN과 APP에서 자체적으로 소셜 로그인 주소를 가져올 경우

```
http://localhost:1337/auth/Any Provider Name/callback?access_token=${access_token}
```

1.1 **node_modules에서 파일 복사**
```
extensions/users-permissions/services/Providers.js
extensions/users-permissions/config/functions/bootstrap.js
extensions/users-permissions/admin/src/components/PopUpForm/index.js
extensions/users-permissions/admin/src/translations/en.json
```
1.2 **Provider.js 수정(예시 카카오)**

2.2.1 Purest 설정 : kakao로그인 시도 시 토큰 불러오기, 토큰 기반 정보 불러오기 설정

```
case "kakao": {
      const kakao = purest({
        provider: "kakao",
        config: {
          kakao: {
            "https://kapi.kakao.com": {
              __domain: {
                auth: {
                  auth: { bearer: "[0]" },
                },
              },
              "[version]/{endpoint}": {
                __path: {
                  alias: "__default",
                  version: "v2",
                },
              },
            },
            "https://kauth.kakao.com": {
              "oauth/{endpoint}": {
                __path: {
                  alias: "oauth",
                },
              },
            },
          },
        },
      });
```

1.2.2 Purest 설정기반으로 유저정보 불러오고 Callback(회원 아닐 경우 회원가입까지)

```
kakao
      .query()
      .get("user/me")
      .qs({ access_token })
      .request((err, res, body) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {
            username: body.kakao_account.email.split("@")[0],
            email: body.kakao_account.email,
          });
        }
      });
    break;
  }
```

1.3 **bootstrap.js 파일 수정하기(Strapi Provider 탭 보이게 추가 됨)**

Icon의 경우 수정 방법 알게 되면 수정해야 함(문의 중)

```
kakao: {
      enabled: false,
      icon: "Any Icon",
      key: "",
      secret: "",
      callback: `${strapi.config.server.url}/auth/kakao/callback`,
    },
```

1.4 **/admin/src/components/PopUpForm/index.js 파일 수정**

Kakao Developers에서 설정한 Callback 주소를 입력한다.

```
case "kakao":
        return `${strapi.backendURL}/connect/kakao/callback`;
```

1.5 **/admin/src/translations/en.json, ko.json 수정**

ko.json의 경우 만약 한국어를 이용하지 않는 경우 수정하지 않아도 무관하다

```
"PopUpForm.Providers.kakao.providerConfig.redirectURL": "The redirect URL to add in your Kakao application configurations",
"PopUpForm.Providers.kakao.providerConfig.redirectURL": "Kakao 애플리케이션 구성에 추가 할 리다이렉트 URL",
```
