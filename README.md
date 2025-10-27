# 📘 OnlineTest

Ứng dụng **OnlineTest** — nền tảng thi trực tuyến (online exam/test) gồm **Backend (Spring Boot)** và **Frontend (React)**.

---

## ⚙️ 1. Cấu trúc dự án

```
OnlineTest/
│
├── backend/                # Spring Boot project (Java)
│   ├── src/
│   ├── pom.xml
│   └── ...
│
└── frontend/               # React project (TypeScript/JavaScript)
    ├── src/
    ├── package.json
    └── ...
```

---

## 🚀 2. Chạy Backend (Spring Boot)

### 🔧 Yêu cầu:
- Java 17+
- Maven 3.8+
- MySQL hoặc PostgreSQL (hoặc bất kỳ DB quan hệ nào)

### ▶️ Cách chạy:
Mở terminal trong `backend`:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Hoặc chạy file JAR đã build:
```bash
java -jar target/onlinetest-0.0.1-SNAPSHOT.jar
```

> 🔗 Mặc định backend chạy tại: `http://localhost:8080`


## 💻 3. Chạy Frontend (React)

### 🔧 Yêu cầu:
- Node.js v18+
- npm hoặc yarn

### ▶️ Cách chạy:
Mở terminal trong `frontend`:
```bash
cd frontend
npm install
npm start   # hoặc: yarn start
```

> 🔗 Frontend mặc định chạy tại: `http://localhost:3000`

---
## 🧑‍💻 4. Công nghệ sử dụng

### 🔹 Backend:
- Spring Boot  
- Spring Security  
- JWT Authentication  
- MySQL  
- Maven
- Websocket  
- Sanbox Vnpay
- STMP Email
- Minio
- MongoDB
- Docker
### 🔹 Frontend:
- React  
- TypeScript  
- TailWind CSS  
- Axios  

---
## 🔄 5. CORS & Bảo mật
- Bật CORS cho domain frontend (`http://localhost:3000`) hoặc cấu hình security cho phép origin này.
- Sử dụng JWT cho API bảo mật; refresh token nếu cần.

---


## 🐳 6. (Tùy chọn) Chạy bằng Docker

### Dockerfile (Backend) ví dụ:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Chạy build & run:
```bash
mvn clean package -DskipTests
docker build -t onlinetest-backend:latest -f Dockerfile.backend .
docker run -e SPRING_DATASOURCE_URL=... -p 8080:8080 onlinetest-backend:latest
```

---

## 📜 7. Giấy phép & Tác giả
© 2025 **OnlineTest** — Developed by *Đỗ Quốc Phong*.
