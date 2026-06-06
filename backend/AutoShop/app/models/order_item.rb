class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product, optional: true

  validates :name,     presence: true, length: { maximum: 255 }
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }
  validates :cost,     numericality: { greater_than_or_equal_to: 0 }

  def subtotal
    quantity * cost
  end
end
