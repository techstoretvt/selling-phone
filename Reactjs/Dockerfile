# Sử dụng image node.js v12.x
FROM node:18.16-alpine3.16

# Thiết lập thư mục app
WORKDIR /app

# Sao chép tệp package.json và package-lock.json vào thư mục hiện tại
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

# Sao chép tất cả các tệp trong thư mục hiện tại vào thư mục app
COPY . .

# Build ứng dụng ReactJS
RUN npm run build
RUN npm install --global serve

# Expose cổng 80
# EXPOSE 80

# Khởi chạy ứng dụng
CMD [ "npm", "run", "start" ]
