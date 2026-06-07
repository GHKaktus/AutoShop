# Base API (issue #8)

Реализация Base-группы по `docs/api/openapi.yaml`.

## Эндпоинты

- `GET /` — отдаёт HTML React SPA (`frontend/dist/index.html`, fallback: `frontend/index.html`).
- `GET /catalog/:id?page=0` — товары категории с пагинацией по 20.
- `GET /products/:id` — карточка товара.
- `GET /search?q=...&page=0` — поиск по названию товара.
- `GET /categories` — список всех категорий (публичный, без пагинации).

## Формат товара (Product, API 1.1.0)

- `cost`, `sale_cost` — `number` (float, поддержка копеек). `sale_cost = -1`, если скидки нет.
- `stock` — `integer` — количество единиц на складе (раньше было `boolean`).

## `GET /categories`

Ответ `200 OK` — массив категорий:

```json
[
  { "id": 1, "name": "Аккумуляторы", "description": "Автомобильные аккумуляторы и зарядные устройства" }
]
```

## Пагинация

- Размер страницы: `20`.
- Параметр `page` — с нуля (как в OpenAPI).
- Формат ответа:

```json
{
  "total_items": 25,
  "current_page": 0,
  "page_size": 20,
  "items": [ ... ]
}
```

## Обработка ошибок

- `400 bad_request` — если отсутствует `q` в `/search` или `page < 0`.
- `404 not_found` — если не найдены категория/товар или в поиске нет результатов.

## Тесты

- `test/controllers/api/base_endpoints_test.rb`
- `test/controllers/spa_controller_test.rb`

Запуск:

```bash
cd backend/AutoShop
bin/rails test test/controllers/api/base_endpoints_test.rb test/controllers/spa_controller_test.rb
```
