# syntax=docker/dockerfile:1

# --- Build stage: собираем SPA через Vite ---
FROM node:22-alpine AS build
WORKDIR /app

# Сначала зависимости (для кэширования слоёв)
COPY package*.json ./
RUN npm install

# Затем исходники
COPY . .

# Адрес backend API «вшивается» в сборку (import.meta.env.VITE_API_URL).
# Для деплоя переопределяется через build arg в docker-compose.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Serve stage: статика через nginx ---
FROM nginx:1.27-alpine AS production

# Конфиг с поддержкой SPA-роутинга (history fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
