# 1단계: 빌드 스테이지
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2단계: 실행 스테이지 (Nginx)
FROM nginx:stable-alpine

# Nginx 설정 파일 복사 (SPA 라우팅 지원을 위해 필요)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx의 기본 html 제공 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 개방
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
