class Account < ApplicationRecord
  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP

  has_secure_password

  enum :role, { user: 0, admin: 1 }, default: :user

  has_one  :basket, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :password_reset_codes, dependent: :destroy

  before_validation :normalize_email
  after_create :ensure_basket

  validates :email,
            presence: true,
            format: { with: EMAIL_REGEXP },
            uniqueness: { case_sensitive: false }
  validates :password, length: { in: 6..128 }, if: -> { password.present? }

  def issue_password_reset_code!
    password_reset_codes.active.update_all(consumed_at: Time.current)

    password_reset_codes.create!(
      code:       format("%06d", SecureRandom.random_number(1_000_000)),
      expires_at: PasswordResetCode::TTL.from_now
    )
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase.presence
  end

  def ensure_basket
    create_basket! unless basket
  end
end
