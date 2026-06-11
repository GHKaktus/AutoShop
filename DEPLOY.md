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

## 5. Деплой на VPS по IP (без домена, через Docker)

Если домена нет и приложение доступно только по IP, фронтенд и backend
разводятся **по портам** (разные порты = разные origin, CORS закрывает обращение,
коллизий маршрутов нет):

- Фронтенд: `http://IP_VPS` (порт 80)
- Backend API: `http://IP_VPS:3000`

> ⚠️ По голому IP нет HTTPS — JWT-токены идут по HTTP в открытом виде.
> Подходит для теста/демо. При появлении домена перейдите на поддомены
> `shop.*` / `api.*` + Let's Encrypt (см. раздел 4).

### 5.1. Установка Docker на VPS (Ubuntu/Debian)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version && docker compose version
```

### 5.2. Проверка занятых портов (на VPS уже есть другие приложения)

```bash
sudo ss -tlnp | grep -E ':80|:3000'
```

Если `80` занят — задайте `FRONTEND_PORT=8080` (или другой свободный), если занят
`3000` — `BACKEND_PORT=3001`. Значения `VITE_API_URL` и `FRONTEND_ORIGINS` должны
точно совпадать с тем, как браузер реально открывает фронт и API (включая порт).

### 5.3. Код и `.env`

```bash
git clone https://github.com/GHKaktus/AutoShop.git
cd AutoShop
git checkout frontend-features-update
openssl rand -hex 64          # для SECRET_KEY_BASE
cp .env.example .env
nano .env
```

Пример `.env` для IP-only (фронт на 80, API на 3000):

```dotenv
AUTO_SHOP_DATABASE_USERNAME=auto_shop
AUTO_SHOP_DATABASE_PASSWORD=надёжный_пароль
AUTO_SHOP_DATABASE_NAME=auto_shop_production
SECRET_KEY_BASE=сгенерированный_хэш
FRONTEND_ORIGINS=http://IP_VPS
VITE_API_URL=http://IP_VPS:3000
FRONTEND_PORT=80
BACKEND_PORT=3000
```

> Если фронт не на 80 — добавьте порт и в `FRONTEND_ORIGINS`
> (например `http://IP_VPS:8080`). Если API не на 3000 — поправьте `VITE_API_URL`
> (например `http://IP_VPS:3001`).

### 5.4. Сборка, запуск, файрвол

```bash
docker compose build
docker compose up -d
docker compose ps

sudo ufw allow 80/tcp     # или выбранный FRONTEND_PORT
sudo ufw allow 3000/tcp   # или выбранный BACKEND_PORT (браузер ходит на API напрямую)
```

### 5.5. Проверка

```bash
curl -i http://IP_VPS:3000/up     # backend health → 200
```

Откройте `http://IP_VPS` в браузере — каталог, поиск, корзина, вход и админ-панель
(`/admin`) должны работать.
