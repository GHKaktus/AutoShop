# Auth API (issue #9)

Реализация группы **Auth** по [OpenAPI 1.0.0](../api/openapi.yaml). Закрывает [issue #9](https://github.com/GHKaktus/AutoShop/issues/9).

## Эндпоинты

| Метод | URL | Аутентификация | Описание |
|-------|-----|----------------|----------|
| `POST` | `/auth/sign-up` | — | Регистрация. Возвращает JWT |
| `POST` | `/auth/sign-in` | — | Авторизация. Возвращает JWT |
| `POST` | `/auth/logout`  | `Bearer JWT` | Отзыв текущего токена |

### `POST /auth/sign-up`

Тело запроса (`application/json`):
```json
{ "email": "user@example.com", "password": "MySecurePassword123" }
```

Ответы:
- `201 Created` → `{ "token": "<JWT>" }`
- `400 Bad Request` → `{ "error": "validation_error", "message": "..." }` (email уже занят, пароль короче 6 символов, неверный формат email).

### `POST /auth/sign-in`

Тело запроса:
```json
{ "email": "user@example.com", "password": "MySecurePassword123" }
```

Ответы:
- `200 OK` → `{ "token": "<JWT>" }`
- `401 Unauthorized` → `{ "error": "unauthorized", "message": "Неверный email или пароль" }`.

### `POST /auth/logout`

Заголовок: `Authorization: Bearer <JWT>`.

Ответы:
- `200 OK` — токен добавлен в `JwtDenylist`, последующие запросы с ним отклоняются.
- `401 Unauthorized` — токен отсутствует / уже отозван / просрочен.

## JWT-формат

Алгоритм: **HS256**. Срок жизни: **24 часа** (`JwtService::DEFAULT_TTL`).

Payload:
```json
{
  "sub": 42,                    // Account.id
  "role": "user" | "admin",
  "jti": "uuid-v4",             // нужен для денилиста
  "iat": 1717100000,
  "exp": 1717186400
}
```

Секрет берётся в порядке:
1. `ENV["JWT_SECRET_KEY"]` (рекомендуется задать в `.env`);
2. `Rails.application.credentials.secret_key_base`;
3. `Rails.application.secret_key_base` (Rails 7.1+ fallback).

## Аутентификация других контроллеров

В `Api::BaseController` подключён concern `JwtAuthenticatable`. Чтобы защитить эндпоинт:

```ruby
class Api::BasketController < Api::BaseController
  before_action :authenticate_account!
end
```

Для проверки роли admin (issue #11):

```ruby
before_action :authenticate_account!, :require_admin!
```

## Роль admin

В версии API 1.0.0 роль задаётся **хардкодом**:
- Через `db:seed` создаётся пользователь `admin@autoshop.local` (только в development).
- Вручную: `Account.find_by(email: "...").update!(role: :admin)`.

Перевод выдачи роли на runtime-логику — issue [#12](https://github.com/GHKaktus/AutoShop/issues/12).

## CORS

Инициализатор `config/initializers/cors.rb` пропускает запросы с фронтенда. Origin-ы берутся из `ENV["FRONTEND_ORIGINS"]` (по умолчанию: `http://localhost:3001 http://localhost:5173`).

## Тесты

`backend/AutoShop/test/controllers/api/auth_controller_test.rb` — 8 кейсов: sign-up (успех / дубль / короткий пароль), sign-in (успех / неверный пароль / неизвестный email), logout (успех + повторный отказ / без токена).

Запуск:
```bash
cd backend/AutoShop
bin/rails test test/controllers/api/auth_controller_test.rb
```

## Очистка денилиста

`JwtDenylist.purge_expired!` — удаляет записи с истёкшим `expires_at`. Можно повесить на `solid_queue` (см. `config/recurring.yml`) после реализации фоновых задач.
