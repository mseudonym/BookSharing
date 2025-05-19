# Stage 1: Сборка фронтенда
FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники и собираем проект
COPY . .
RUN npm run build

# Stage 2: Запуск через nginx
FROM nginx:stable-alpine

# Удаляем дефолтный конфиг и копируем свой
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранную статику
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
