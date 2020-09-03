# AWS ec2 배포하기

# 1. EC2 만들기

## 1.1. EC2 Server 선택

## 1.2. EC2 인스턴스 선택

## 1.3. 보안그룹 열어주기

SSH, HTTP, HTTPS를 열어주며 Test용도로 다른 포트를 추가로 열어준다.
RDS를 사용하지 않을 경우에는 3306포트도 열어주도록 한다.

## 1.4. 키페어 생성 후 저장

## 1.5. 탄력적 IP 생성 후 연결

# 2. RDS 만들기

## 2.1. 사용할 DB 선택

## 2.2. 템플릿 선택

대부분의 경우 프리 티어를 이용

## 2.3. 설정

db이름을 정하고 admin의 이름과 비밀번호를 설정한다.

## 2.4. 그 외(프리 티어일 때 )

### 2.4.1. 스토리지 자동 조정 끄기

### 2.4.2. 초기 데이터베이스 이름 설정

### 2.4.3. 백업 보존 기간 1일로 변경

# 3. EC2 접속

pem키가 있는 위치로 이동 후 sudo ssh -i "pemname.pem" ubuntu@ec2-ip-address.ap-northeast-2.compute.amazonaws.com

## 3.1. 정상 접속 후 sudo su를 이용해 root로 접속

## 3.2. 기본 설정

### 3.2.1. apt-get update를 이용해 기본 설치 파일들 업데이트

### 3.2.2. apt-get install -y build-essential을 이용해 빌드에 필요한 내용들 다운로드

### 3.2.3. curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - 로 노드 다운로드

### 3.2.4. apt-get install -y nodejs로 노드 설치

### 3.2.5. 설치 완료 후 node, npm -v로 정상 설치 확인

## 3.3. git clone을 이용해 완성한 프로젝트 다운로드

private 레포인 경우 username@github.com 식으로 입력하면 git pull 시 id 입력 안해도 됨

## 3.4. 프로젝트로 들어간 뒤 sudo npm i 를 한다

root인 경우에도 권한에 걸려 설치가 안되는 경우가 있기 때문에 sudo를 입력해주는게 좋음

## 3.5. nodejs프로젝트인 경우

```
npm i pm2@latest -g를 이용해 pm2 설치
```

## 3.6. 이 아래로는 Strapi일 경우 설정

### 3.6.1. ~경로로 이동 후 pm2 init을 해줌

### 3.6.2. ecosystem.config.js 설정

```
module.exports = {
  apps: [
    {
      name: 'your-app-name',
      cwd: '/home/ubuntu/my-project',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        DATABASE_HOST: 'your-unique-url.rds.amazonaws.com', // database Endpoint under 'Connectivity & Security' tab
        DATABASE_PORT: '5432',
        DATABASE_NAME: 'strapi', // DB name under 'Configuration' tab
        DATABASE_USERNAME: 'postgres', // default username
        DATABASE_PASSWORD: 'Password',
      },
    },
  ],
};
```

### 3.6.3. npm run build로 build하기(인스턴스 small이상에서만 가능)

### 3.6.4. pm2 start ~/ecosystem.config.js && pm2 monit으로 실행

### 3.6.5. pm2 restart all로 무중단 재시작 가능

# 4. Route 53설정

## 4.1. AWS 이외의 곳에서 도메인 구매시

### 4.1.1. 호스트 영역 생성으로 구매한 도메인 등록

### 4.1.2. NS의 값으로 도메인 구입처에서 관리대상 변경

## 4.2. A영역으로 레코드 생성 후 연결하려는 EC2 IP와 연결

## 4.3. www이용 시 CNAME로 레코드를 생성

## 4.4. 정상적으로 도메인으로 접근 확인

# 5. HTTPS 설정

## 5.1. EC2 접속 후 apt-get install -y nginx로 엔진엑스를 설치한다.

## 5.2. vim /etc/nginx/nginx.conf 접근 후 프록시 설정을 해준다.

```
server {
          server_name hadawork.com;
          location / {
                  proxy_set_header HOST $host;
                  proxy_pass http://127.0.0.1:1337;
                  proxy_redirect off;
          }
}
```

## 5.3. wget https://dl.eff.org/certbot-auto 입력 해 certbot-auto을 설치한다.

## 5.4. chmod a+x certbot-auto로 쓰기권한을 설정해준다.

## 5.5. ./certbot-auto로 certbot-auto를 실행하면 설치가 완료된다.

# 6. crontab으로 certbot-auto 갱신 자동화

## 6.1. crontab 자주쓰는 명령어

```
crontab -l // crontab 보기
crontab -e // crontab 편집
view /var/log/syslog // crontab 실행 로그
```

## 6.2. crontab 규칙

<img src="https://www.ostechnix.com/wp-content/uploads/2018/05/cron-job-format-1.png" alt="crontab-role" />

## 6.3. 등록 예시

매 월 15일에 certbot-auto 갱신 후 nginx 재실행

```
 0 18 15 * * /home/ubuntu/project-name/certbot-auto renew --renew-hook="/etc/init.d/nginx reload"
```
