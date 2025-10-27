# 🧱 Base image có sẵn JDK 17
FROM eclipse-temurin:17-jdk-alpine

# 🏷️ Metadata
LABEL maintainer="yourname@example.com"

# 🏗️ Tạo thư mục app trong container
WORKDIR /app

# 🧩 Copy file jar vào container
COPY target/law-app.jar app.jar

# 🌍 Cấu hình cổng
EXPOSE 8080

# 🚀 Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
