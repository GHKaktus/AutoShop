# Схема БД AutoShop

Документ описывает сущности БД для версии API **1.0.0** (см. [`docs/api/openapi.yaml`](../api/openapi.yaml)). Решает issue [#7](https://github.com/GHKaktus/AutoShop/issues/7).

СУБД — **PostgreSQL** (порт 5432, конфиг в `backend/AutoShop/config/database.yml`). Все таблицы используют автоинкрементный `bigserial id` и стандартные Rails `created_at`/`updated_at`.

## ER-диаграмма (упрощённая)

```
                +--------------+
                |   accounts   |
                +--------------+
                | id           |
                | email        |
                | password_*** |
                | role         |
                +--------------+
                  | 1     1 |
       +----------+         +-----------+
       |                                |
       v 1                            * v
+--------------+                  +---------+
|   baskets    |                  | orders  |
+--------------+                  +---------+
| account_id   |                  | account_id
+--------------+                  | name/phone/email/comment/address
       | 1                        | status/total_amount
       |                          +---------+
       v *                              | 1
+---------------+                       v *
| basket_items  |                 +---------------+
+---------------+                 |  order_items  |
| basket_id     |                 +---------------+
| product_id    |                 | order_id      |
| quantity      |                 | product_id?   |
+---------------+                 | name (snap)   |
       | *                        | cost (snap)   |
       v 1                        | quantity      |
+---------------+                 +---------------+
|   products    | <--------------- product_id (nullable)
+---------------+
| name/cost/sale_cost
| picture/description
| stock
| category_id
+---------------+
       | *
       v 1
+---------------+
|  categories   |
+---------------+
| name/slug/image/position
+---------------+


+--------------+
| jwt_denylist |   (отзыв JWT при logout)
+--------------+
| jti (unique) |
| expires_at   |
+--------------+
```

---

## Таблицы

### `accounts`
Аккаунт пользователя. Соответствует схеме `Account` в OpenAPI.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | Идентификатор |
| `email` | string | NOT NULL, UNIQUE (по `LOWER(email)`) | Email — логин |
| `password_digest` | string | NOT NULL | Хеш пароля (`bcrypt`, через `has_secure_password`) |
| `role` | integer | NOT NULL, default `0` | `0 = user`, `1 = admin` (Rails enum) |
| `created_at`, `updated_at` | timestamp | NOT NULL | Стандартные |

**Индексы:** `LOWER(email)` (unique), `role`.

### `categories`
Категории каталога — нужны для эндпоинта `GET /catalog/{id}`. Базовые 4 категории создаются `db:seed`.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | Идентификатор |
| `name` | string | NOT NULL | Отображаемое имя (Аккумуляторы, …) |
| `slug` | string | NOT NULL, UNIQUE | URL-идентификатор (`avtomasla`, …) |
| `image` | string | NULL | Относительный путь к иконке |
| `position` | integer | NOT NULL, default `0` | Порядок отображения |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

### `products`
Товар. Соответствует схеме `Product` в OpenAPI. Добавлено поле `category_id` для разбиения каталога.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `name` | string | NOT NULL | Название |
| `cost` | integer | NOT NULL ≥ 0 | Цена в рублях |
| `sale_cost` | integer | NOT NULL, default `-1` | Скидочная цена. `-1` ⇒ скидки нет |
| `picture` | string | NULL | Относительный путь к картинке |
| `description` | text | NULL | Описание |
| `stock` | boolean | NOT NULL, default `true` | Есть ли на складе |
| `category_id` | bigint | NOT NULL, FK → `categories.id` | |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

**Индексы:** `category_id`, `name`, `stock`.

### `baskets`
Корзина — одна на пользователя. Создаётся автоматически после регистрации (`Account#after_create`).

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `account_id` | bigint | NOT NULL, UNIQUE, FK → `accounts.id` | Владелец |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

### `basket_items`
Позиция корзины.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `basket_id` | bigint | NOT NULL, FK → `baskets.id` | |
| `product_id` | bigint | NOT NULL, FK → `products.id` | |
| `quantity` | integer | NOT NULL, default `1`, CHECK `> 0` | |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

**Индексы:** UNIQUE `(basket_id, product_id)` — один товар не дублируется, только увеличивается `quantity`.

### `orders`
Заказ. Соответствует схеме `Order` в OpenAPI.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `account_id` | bigint | NOT NULL, FK → `accounts.id` | `user_id` в OpenAPI |
| `name` | string | NOT NULL, 2..100 | Имя покупателя |
| `phone` | string | NOT NULL, regex `^\+?\d{10,15}$` | Телефон |
| `email` | string | NOT NULL, формат email | Email |
| `comment` | text | NULL, до 500 символов | Комментарий |
| `address` | string | NOT NULL, до 300 символов | Адрес доставки |
| `status` | integer | NOT NULL, default `0` | `pending/processing/shipped/delivered/cancelled` |
| `total_amount` | integer | NOT NULL ≥ 0 | Итоговая сумма в рублях (снапшот) |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

**Индексы:** `account_id`, `status`, `created_at`.

### `order_items`
Позиция заказа. **Хранится снапшот** (`name`, `cost`) — заказ не «потеряется» при изменении/удалении товара. `product_id` опционален: при удалении товара заказ остаётся целым.

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `order_id` | bigint | NOT NULL, FK → `orders.id` | |
| `product_id` | bigint | NULL, FK → `products.id` | На случай удаления товара |
| `name` | string | NOT NULL | Снапшот имени |
| `quantity` | integer | NOT NULL, CHECK `> 0` | |
| `cost` | integer | NOT NULL, CHECK `≥ 0` | Снапшот цены за единицу |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

### `jwt_denylist`
Отозванные JWT-токены (нужно для `POST /auth/logout`).

| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| `id` | bigserial | PK | |
| `jti` | string | NOT NULL, UNIQUE | JWT ID из payload |
| `expires_at` | datetime | NOT NULL | Когда токен истекает (для очистки) |
| `created_at`, `updated_at` | timestamp | NOT NULL | |

Очистка устаревших записей: `JwtDenylist.purge_expired!` (можно вешать на cron / `solid_queue`).

---

## Связи (ActiveRecord)

| Модель | Связь | Целевая модель | Опции |
|--------|-------|----------------|-------|
| `Account` | `has_one`     | `Basket` | `dependent: :destroy` |
| `Account` | `has_many`    | `Order`  | `dependent: :destroy` |
| `Basket`  | `belongs_to`  | `Account` | |
| `Basket`  | `has_many`    | `BasketItem` | `dependent: :destroy` |
| `BasketItem` | `belongs_to` | `Basket` | |
| `BasketItem` | `belongs_to` | `Product` | |
| `Category` | `has_many`   | `Product` | `dependent: :restrict_with_error` |
| `Product` | `belongs_to`  | `Category` | |
| `Product` | `has_many`    | `OrderItem` | `dependent: :nullify` |
| `Order`   | `belongs_to`  | `Account` | |
| `Order`   | `has_many`    | `OrderItem` | `dependent: :destroy` |
| `OrderItem` | `belongs_to` | `Order` | |
| `OrderItem` | `belongs_to` | `Product` | `optional: true` |

---

## Перечень миграций

Все миграции лежат в `backend/AutoShop/db/migrate/`:

1. `20260601200001_create_accounts.rb`
2. `20260601200002_create_categories.rb`
3. `20260601200003_create_products.rb`
4. `20260601200004_create_baskets.rb`
5. `20260601200005_create_basket_items.rb`
6. `20260601200006_create_orders.rb`
7. `20260601200007_create_order_items.rb`
8. `20260601200008_create_jwt_denylist.rb`

---

## Применение

```bash
cd backend/AutoShop
bundle install      # подтянет bcrypt, jwt, rack-cors, kaminari, dotenv-rails
rails db:create
rails db:migrate
rails db:seed       # создаст 4 категории и admin@autoshop.local (только в dev)
```

---

## Замечания и расширения на будущее

* **`Account#role`** пока выдаётся хардкодом (по плану версии 1.0.0). В следующей итерации (issue [#12](https://github.com/GHKaktus/AutoShop/issues/12)) нужно будет добавить механизм назначения роли.
* **`Product.picture`** хранит относительный путь (`/images/...`) — соответствует решению из issue [#8](https://github.com/GHKaktus/AutoShop/issues/8). При переходе на S3 заменим на Active Storage attachment (`image_processing` уже в Gemfile).
* **Активные сессии**: вместо денилиста можно реализовать allowlist по `jti`, если потребуется управление списком активных устройств.
* **Цены хранятся в `integer`** (рубли, как в OpenAPI). Если потребуются копейки — миграция `change_column :products, :cost, :integer` + домен пересчёта.
