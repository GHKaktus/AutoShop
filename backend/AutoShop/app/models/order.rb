class Order < ApplicationRecord
  PHONE_REGEXP = /\A\+?\d{10,15}\z/
  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP

  belongs_to :account

  has_many :order_items, dependent: :destroy

  enum :status,
       { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: 4 },
       default: :pending

  validates :name,    presence: true, length: { in: 2..100 }
  validates :phone,   presence: true, format: { with: PHONE_REGEXP }
  validates :email,   presence: true, format: { with: EMAIL_REGEXP }
  validates :comment, length: { maximum: 500 }, allow_blank: true
  validates :total_amount,
            numericality: { greater_than_or_equal_to: 0 }
  validates :order_items, length: { minimum: 1, message: "must contain at least one item" }

  scope :recent, -> { order(created_at: :desc) }
end
