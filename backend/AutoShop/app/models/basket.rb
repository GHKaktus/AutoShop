class Basket < ApplicationRecord
  belongs_to :account

  has_many :basket_items, dependent: :destroy
  has_many :products,     through:  :basket_items

  validates :account_id, uniqueness: true

  def total_amount
    basket_items.includes(:product).sum { |item| item.quantity * item.product.effective_cost }
  end

  def total_items_count
    basket_items.sum(:quantity)
  end

  def clear!
    basket_items.destroy_all
  end
end
