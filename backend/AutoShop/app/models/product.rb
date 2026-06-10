class Product < ApplicationRecord
  NO_SALE = -1

  # Эффективная цена с учётом скидки (sale_cost), выраженная в SQL для фильтров/сортировки.
  EFFECTIVE_PRICE_SQL = "CASE WHEN sale_cost >= 0 AND sale_cost < cost THEN sale_cost ELSE cost END".freeze

  class StockInsufficient < StandardError; end

  belongs_to :category

  has_many :basket_items, dependent: :destroy
  has_many :baskets,      through:  :basket_items
  has_many :order_items,  dependent: :nullify

  validates :name, presence: true, length: { maximum: 255 }
  validates :cost, numericality: { greater_than_or_equal_to: 0 }
  validates :sale_cost,
            numericality: { greater_than_or_equal_to: -1 }
  validates :description, length: { maximum: 5_000 }, allow_blank: true
  validates :picture,     length: { maximum: 500 },   allow_blank: true
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :in_stock,    -> { where("stock > 0") }
  scope :by_category, ->(category_id) { where(category_id: category_id) }
  scope :search,      ->(query) { where("LOWER(name) LIKE ?", "%#{query.to_s.downcase}%") }

  # Фильтр по наличию: in_stock — в наличии, out_of_stock — под заказ (0), all/прочее — все.
  scope :with_availability, lambda { |filter|
    case filter.to_s
    when "in_stock"     then where("stock > 0")
    when "out_of_stock" then where(stock: 0)
    else all
    end
  }

  # Фильтр по эффективной цене (учитывает скидку). Границы опциональны.
  scope :priced_between, lambda { |min, max|
    relation = all
    relation = relation.where("#{EFFECTIVE_PRICE_SQL} >= ?", min.to_f) if min.present?
    relation = relation.where("#{EFFECTIVE_PRICE_SQL} <= ?", max.to_f) if max.present?
    relation
  }

  # Сортировка каталога. popularity (по умолчанию) — по числу заказов товара.
  scope :sorted_by, lambda { |sort_key|
    case sort_key.to_s
    when "price_asc"  then order(Arel.sql("#{EFFECTIVE_PRICE_SQL} ASC, products.id ASC"))
    when "price_desc" then order(Arel.sql("#{EFFECTIVE_PRICE_SQL} DESC, products.id ASC"))
    when "status"     then order(Arel.sql("(stock > 0) DESC, products.id ASC"))
    else
      order(Arel.sql(
        "(SELECT COUNT(*) FROM order_items WHERE order_items.product_id = products.id) DESC, products.id ASC"
      ))
    end
  }

  def on_sale?
    sale_cost.to_f >= 0 && sale_cost < cost
  end

  def effective_cost
    on_sale? ? sale_cost : cost
  end

  def decrement_stock!(quantity)
    qty = quantity.to_i
    raise ArgumentError, "quantity must be positive" if qty < 1

    with_lock do
      if qty > stock
        raise StockInsufficient,
              "Недостаточно товара «#{name}» на складе (доступно: #{stock})"
      end

      update!(stock: stock - qty)
    end
  end
end
