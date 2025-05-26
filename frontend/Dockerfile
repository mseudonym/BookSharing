# Этап 1: сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG BS_API_BASE_URL
ENV VITE_BS_API_BASE_URL=$BS_API_BASE_URL

RUN npm run build

# Этап 2: запуск через статический сервер
FROM nginx:alpine
USER nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
