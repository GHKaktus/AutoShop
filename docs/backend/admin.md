# Admin API (issue #11, обновлено для API 1.1.0)

Административные эндпоинты по `docs/api/openapi.yaml`. Доступ только с JWT и ролью **admin**.

## Авторизация

```
Authorization: Bearer <JWT>
```

- `401` — токен отсутствует / недействителен / отозван.
- `403` — пользователь не admin.

Начальный admin задаётся seed-ом (`admin@autoshop.local` в development). Начиная с API 1.1.0 роль можно назначать через `PUT /admin/users/:userId/role`.

## Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/admin/orders` | Список заказов (пагинация, page с 0, размер 20) |
| `DELETE` | `/admin/orders` | Удалить **все** заказы |
| `GET` | `/admin/orders/:id` | Заказ по ID |
| `PUT` | `/admin/orders/:id` | Обновить статус заказа |
| `DELETE` | `/admin/orders/:id` | Удалить один заказ |
| `GET` | `/admin/users` | Список пользователей |
| `DELETE` | `/admin/users` | Удалить **всех** пользователей |
| `PUT` | `/admin/users/:userId/role` | Назначить роль (`user`/`admin`) |
| `GET` | `/admin/products` | Список товаров |
| `POST` | `/admin/products` | Создать товар |
| `GET` | `/admin/products/:id` | Товар по ID |
| `PUT` | `/admin/products/:id` | Обновить товар |
| `DELETE` | `/admin/products/:id` | Удалить товар |
| `POST` | `/admin/categories` | Создать категорию |
| `GET` | `/admin/categories/:id` | Категория по ID |
| `PUT` | `/admin/categories/:id` | Обновить категорию |
| `DELETE` | `/admin/categories/:id` | Удалить категорию |

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
| `cost` | да | Цена, `number`/float (≥ 0) |
| `category_id` | да | ID категории |
| `sale_cost` | нет | `number`/float, по умолчанию `-1` |
| `picture` | нет | Путь к изображению |
| `description` | нет | Описание |
| `stock` | нет | `integer` — количество на складе, по умолчанию `0` |

Ответ `201 Created` — объект `Product` (схема Product в OpenAPI).

### `GET/PUT/DELETE /admin/products/:id`

- `GET` — товар по ID (`Product`), `404` если нет.
- `PUT` — частичное обновление (любое подмножество полей из `POST`). Ответ `200` — `Product`, `400 validation_error` при невалидных данных.
- `DELETE` — удаление товара. Ответ `200 OK`.

### `GET/PUT/DELETE /admin/orders/:id`

- `GET` — заказ по ID (`Order`).
- `PUT` — обновление статуса. Тело: `{ "status": "processing" }` (`pending|processing|shipped|delivered|cancelled`). `400 validation_error` при недопустимом статусе.
- `DELETE` — удаление одного заказа. Ответ `200 OK`.

### `PUT /admin/users/:userId/role`

Тело: `{ "role": "admin" }` (`user`/`admin`). Ответ `200` — объект `Account`. Ошибки: `400` (недопустимая роль), `404` (пользователь не найден).

### `POST/GET/PUT/DELETE /admin/categories`

`CategoryForm`: `{ "name": "Тормоза", "description": "..." }` (`description` опционально).

- `POST` → `201` + `Category`.
- `GET /admin/categories/:id` → `Category`.
- `PUT /admin/categories/:id` → `200` + `Category`.
- `DELETE /admin/categories/:id` → `200 OK`; `400 validation_error`, если в категории есть товары (`restrict_with_error`).

## Тесты

`test/controllers/api/admin/admin_endpoints_test.rb`

```bash
cd backend/AutoShop
bin/rails test test/controllers/api/admin/admin_endpoints_test.rb
```
