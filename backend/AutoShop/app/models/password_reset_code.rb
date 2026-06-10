class PasswordResetCode < ApplicationRecord
  TTL = 15.minutes

  belongs_to :account

  validates :code, presence: true
  validates :expires_at, presence: true

  scope :active, -> { where(consumed_at: nil).where("expires_at > ?", Time.current) }

  def consume!
    update!(consumed_at: Time.current)
  end
end
