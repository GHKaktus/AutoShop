# Admin API (issue #11)

Временные административные эндпоинты по `docs/api/openapi.yaml`. Доступ только с JWT и ролью **admin**.

## Авторизация

```
Authorization: Bearer <JWT>
```

- `401` — токен отсутствует / недействителен / отозван.
- `403` — пользователь не admin.

Роль admin в API 1.0.0 задаётся хардкодом (seed: `admin@autoshop.local` в development).

## Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/admin/orders` | Список заказов (пагинация, page с 0, размер 20) |
| `DELETE` | `/admin/orders` | Удалить **все** заказы |
| `GET` | `/admin/users` | Список пользователей |
| `DELETE` | `/admin/users` | Удалить **всех** пользователей |
| `GET` | `/admin/products` | Список товаров |
| `POST` | `/admin/products` | Создать товар |

### `GET /admin/orders`

Ответ:
```json
{
  "total_orders": 10,
  "current_page": 0,
  "page_size": 20,
  "orders": [ { "...": "схема Order" } ]
}
```

### `DELETE /admin/orders`

Ответ: `{ "deleted_count": 10 }`

### `GET /admin/users`

Ответ: `{ "total_users", "current_page", "page_size", "users": [ Account, ... ] }`.

### `DELETE /admin/users`

Ответ: `{ "deleted_count": 5 }`

### `GET /admin/products`

Ответ:
```json
{
  "total_products": 50,
  "current_page": 0,
  "page_size": 20,
  "products": [ { "...": "схема Product" } ]
}
```

### `POST /admin/products`

Тело (см. `docs/api/openapi.yaml`):

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `name` | да | Название |
| `cost` | да | Цена (≥ 0) |
| `category_id` | да | ID категории |
| `sale_cost` | нет | По умолчанию `-1` |
| `picture` | нет | Путь к изображению |
| `description` | нет | Описание |
| `stock` | нет | По умолчанию `true` |

Ответ `201 Created` — объект `Product` (схема Product в OpenAPI).

## Тесты

`test/controllers/api/admin/admin_endpoints_test.rb`

```bash
cd backend/AutoShop
bin/rails test test/controllers/api/admin/admin_endpoints_test.rb
```
