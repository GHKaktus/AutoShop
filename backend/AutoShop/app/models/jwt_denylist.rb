class JwtDenylist < ApplicationRecord
  self.table_name = "jwt_denylist"

  validates :jti,        presence: true, uniqueness: true
  validates :expires_at, presence: true

  scope :active, -> { where("expires_at > ?", Time.current) }

  def self.revoked?(jti)
    active.exists?(jti: jti)
  end

  def self.revoke!(jti:, expires_at:)
    create!(jti: jti, expires_at: expires_at)
  end

  def self.purge_expired!
    where("expires_at <= ?", Time.current).delete_all
  end
end
