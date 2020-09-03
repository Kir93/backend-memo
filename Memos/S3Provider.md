# [S3Provider](https://strapi.io/documentation/v3.x/plugins/upload.html#using-a-provider)

# 1. 만들어져 있는 NPM 설치

```
npm install strapi-provider-upload-aws-s3 --save
```

# 2. Upload provider Local에서 S3로 변경

Root 아래 경로에 설정 파일 만들기

```
./config/plugins.js
```

```
module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: "AWS_ACCESS_KEY_ID",
      secretAccessKey: "AWS_ACCESS_SECRET",
      region: "aws-region",
      params: {
        Bucket: "bucket-name",
      },
    },
  },
});
```

# 3. S3 Bucket 만들기

[S3 주소](https://s3.console.aws.amazon.com/) 들어가 버킷 만들기

## 3.1 이름 및 지역

중복되지 않는 버킷이름을 입력하고 리전은 서울로 하는게 속도가 빠름

## 3.2 권한 설정

퍼블릭 액세스 권한은 모두 비활성화 해 줌

## 3.3 버킷 정책

버킷 생성 후 버킷에 들어간 뒤 권한 > 버킷 정책에 들어가 아래 정책을 입력

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::bucket-name/*",
                "arn:aws:s3:::bucket-name"
            ]
        }
    ]
}
```

## 3.4 엑세스 키 발급

엑세스 키가 없는 경우 발급 받고 아닌 경우 엑세스키 파일을 저장

## 3.5 CORS 구성

이미지만 있는 경우에는 상관 없지만 영상의 경우 Strapi 어드민 패널에서 CORS 이슈가 발생 해 추가 해 줌

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

# 4. Config 파일 수정

위에서 설정한 내용대로 Config파일의 내용을 수정한다.

# 5. 서버 시작

이제 이미지 저장 시 Local경로에 저장되지 않고 S3에 저장되는 것을 확인할 수 있다.
