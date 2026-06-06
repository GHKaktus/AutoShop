class BasketItem < ApplicationRecord
  belongs_to :basket
  belongs_to :product

  validates :product_id, uniqueness: { scope: :basket_id }
  validates :quantity,   numericality: { only_integer: true, greater_than: 0 }
  validate  :quantity_within_stock

  private

  def quantity_within_stock
    return if product.blank? || quantity.blank?
    return if quantity <= product.stock

    errors.add(:quantity, "превышает количество на складе (доступно: #{product.stock})")
  end
end
