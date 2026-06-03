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

Поля ответа соответствуют OpenAPI (в т.ч. `total_orders` и `orders` для массива аккаунтов).

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

Тело (обязательные поля по модели): `name`, `cost`, `category_id`; опционально: `sale_cost`, `picture`, `description`, `stock`.

Ответ `201 Created` — объект `Product`.

## Тесты

`test/controllers/api/admin/admin_endpoints_test.rb`

```bash
cd backend/AutoShop
bin/rails test test/controllers/api/admin/admin_endpoints_test.rb
```
