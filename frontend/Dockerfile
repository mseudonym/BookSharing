# Этап 1: сборка приложения
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
        npm install -g npm@11.4.2 && \
        npm install --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build

# Этап 2: запуск через статический сервер
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Подтягиваем нужны переменные при запуске контейнера
COPY infra/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
