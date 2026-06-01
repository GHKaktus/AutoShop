class Account < ApplicationRecord
  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP

  has_secure_password

  enum :role, { user: 0, admin: 1 }, default: :user

  has_one  :basket, dependent: :destroy
  has_many :orders, dependent: :destroy

  before_validation :normalize_email
  after_create :ensure_basket

  validates :email,
            presence: true,
            format: { with: EMAIL_REGEXP },
            uniqueness: { case_sensitive: false }
  validates :password, length: { in: 6..128 }, if: -> { password.present? }

  private

  def normalize_email
    self.email = email.to_s.strip.downcase.presence
  end

  def ensure_basket
    create_basket! unless basket
  end
end
