# Basket API (issue #10)

Реализация Basket-группы по `docs/api/openapi.yaml`. Все эндпоинты требуют JWT (`Authorization: Bearer <token>`).

## Эндпоинты

### `GET /basket`

Возвращает содержимое корзины текущего пользователя.

Ответ `200 OK`:
```json
{
  "items": [
    { "product": { "id": 1, "name": "Фильтр", "cost": 500.0, "sale_cost": -1.0, "picture": null, "description": null, "stock": 10 }, "quantity": 2 }
  ]
}
```

### `POST /basket`

Добавляет товар в корзину. Если позиция уже присутствует — `quantity` **суммируется**.

Тело:
```json
{ "product_id": 1, "quantity": 2 }
```

Ответы:
- `200 OK` — успех;
- `400 bad_request` — `quantity` < 1 или нет `product_id`;
- `400 validation_error` — итоговое количество в корзине превышает остаток на складе (`product.stock`);
- `404 not_found` — товар не найден;
- `401 unauthorized` — без токена.

> Нельзя положить в корзину больше единиц товара, чем есть на складе. Проверка учитывает уже добавленное количество (суммарно по позиции).

### `PATCH /basket/:id` (API 1.2.0)

`:id` — это **`product_id`**. Устанавливает новое количество товара в корзине.

Тело:
```json
{ "quantity": 3 }
```

- `quantity = 0` — позиция удаляется из корзины.
- `quantity` должен быть целым ≥ 0 и не превышать остаток на складе.

Ответы:
- `200 OK`;
- `400 bad_request` — `quantity` не задан / не целое / отрицательное;
- `400 validation_error` — превышение остатка на складе;
- `404 not_found` — товар не в корзине;
- `401 unauthorized` — без токена.

### `DELETE /basket/:id`

`:id` — это **`product_id`**, как указано в OpenAPI («ID товара, который нужно удалить из корзины»). Удаляет позицию полностью.

Ответы:
- `200 OK`;
- `404 not_found` — товар не в корзине.

### `POST /basket/order`

Создаёт заказ из текущей корзины, делает снапшот товаров (`name`, `cost`), списывает остаток со склада (`product.stock`), очищает корзину.

Тело (`OrderForm`):
```json
{ "name": "Иван", "phone": "+79161234567", "email": "ivan@example.com", "comment": "Срочно" }
```

Ответ `201 Created`:
```json
{ "order_id": 12345, "total_amount": 2500.0, "message": "Заказ принят. С вами свяжутся для подтверждения." }
```

Ошибки:
- `400 bad_request` — пустая корзина или некорректные поля формы (формат телефона/email, короткое имя и т. п.);
- `400 validation_error` — на складе недостаточно товара для оформления (остаток мог уменьшиться после добавления в корзину);
- `401 unauthorized` — без токена.

## Замечания

- API 1.1.0: поле `address` удалено из схемы `Order` и из БД (на фронте нет ввода адреса). `OrderForm` принимает только `name`, `phone`, `email`, `comment`.
- `total_amount` считается на сервере как сумма `cost * quantity` со снапшотом цен (учитывается `sale_cost`); тип — `number` (float).
- При успешном оформлении `product.stock` уменьшается на заказанное количество (в одной транзакции с созданием заказа и очисткой корзины).
- Корзина автоматически создаётся при регистрации пользователя (`Account.after_create :ensure_basket`) и при первом обращении к Basket API.

## Тесты

- `test/controllers/api/basket_controller_test.rb` — корзина (GET/POST/DELETE).
- `test/controllers/api/basket/orders_controller_test.rb` — оформление заказа.

Запуск:
```bash
cd backend/AutoShop
bin/rails test test/controllers/api/basket_controller_test.rb test/controllers/api/basket/orders_controller_test.rb
```
