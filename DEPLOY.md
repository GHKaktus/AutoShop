# Деплой AutoShop через Docker

Приложение разворачивается тремя контейнерами через Docker Compose:

| Сервис     | Образ / сборка                  | Назначение                          | Порт (хост) |
|------------|---------------------------------|-------------------------------------|-------------|
| `db`       | `postgres:16-alpine`            | PostgreSQL                          | —           |
| `backend`  | `backend/AutoShop/Dockerfile`   | Rails API (Puma + Thruster)         | `3000`      |
| `frontend` | `frontend/Dockerfile`           | React SPA (nginx, статика)          | `80`        |

Frontend и backend работают на разных origin'ах: пути API (`/catalog`, `/basket`,
`/search`, `/admin`, `/products`) пересекаются с маршрутами SPA, поэтому проксировать
их по одному адресу нельзя. Связь идёт по CORS — адрес API «вшивается» в сборку
фронтенда (`VITE_API_URL`), а backend разрешает origin фронтенда через `FRONTEND_ORIGINS`.

## 1. Подготовка окружения

```bash
cp .env.example .env
```

Заполните `.env`:

- `AUTO_SHOP_DATABASE_PASSWORD` — пароль БД (придумайте надёжный).
- `SECRET_KEY_BASE` — обязательный секрет Rails. Сгенерируйте:
  ```bash
  openssl rand -hex 64
  ```
- `VITE_API_URL` — публичный адрес backend. Локально `http://localhost:3000`,
  на сервере, например, `https://api.example.com`.
- `FRONTEND_ORIGINS` — публичный адрес фронтенда (через пробел можно несколько),
  например `https://shop.example.com`.

## 2. Сборка и запуск

```bash
docker compose build
docker compose up -d
```

При первом старте `backend` сам создаёт и мигрирует БД
(`auto_shop_production` + служебные `_cache`/`_queue`/`_cable`) и загружает
сиды (категории, товары, учётная запись администратора) через `db:prepare`.

Проверка статуса:

```bash
docker compose ps
docker compose logs -f backend
```

- Фронтенд: `http://<сервер>` (порт 80)
- API health-check: `http://<сервер>:3000/up`

## 3. Полезные команды

```bash
# Перезапуск после изменений в коде
docker compose build && docker compose up -d

# Принудительно перезагрузить сиды / выполнить произвольную задачу
docker compose exec backend ./bin/rails db:seed

# Консоль Rails
docker compose exec backend ./bin/rails console

# Логи
docker compose logs -f frontend backend db

# Остановить (данные БД и загрузки сохраняются в volume)
docker compose down

# Полная очистка ВМЕСТЕ с данными
docker compose down -v
```

## 4. Замечания по продакшену

- Данные БД хранятся в volume `db_data`, загруженные файлы — в `storage_data`.
- Для HTTPS поставьте перед контейнерами обратный прокси (nginx/Traefik/Caddy)
  с TLS-сертификатом и проксируйте на `frontend:80` и `backend:80`.
- `VITE_API_URL` фиксируется на этапе сборки фронтенда — при смене адреса API
  пересоберите образ `frontend` (`docker compose build frontend`).
- Порты на хосте настраиваются через `FRONTEND_PORT` / `BACKEND_PORT` в `.env`.
