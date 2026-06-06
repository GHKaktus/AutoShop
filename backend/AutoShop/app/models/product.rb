class Product < ApplicationRecord
  NO_SALE = -1

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
