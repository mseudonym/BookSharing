# Этап 1: сборка приложения
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .    
RUN npm run build

# Этап 2: запуск через статический сервер
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
