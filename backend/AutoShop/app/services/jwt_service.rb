require "jwt"

class JwtService
  class DecodeError < StandardError; end

  ALGORITHM   = "HS256".freeze #HMAC SHA-256 алг шифрования
  DEFAULT_TTL = 24.hours #время жизни токена

  # Методы класса
  class << self
    def encode(account:, ttl: DEFAULT_TTL)
      issued_at  = Time.current
      expires_at = issued_at + ttl

      payload = {
        sub:  account.id,
        role: account.role,
        jti:  SecureRandom.uuid,
        iat:  issued_at.to_i,
        exp:  expires_at.to_i
      }

      token = JWT.encode(payload, secret_key, ALGORITHM)
      { token: token, payload: payload, expires_at: expires_at }
    end

    def decode(token)
      payload, = JWT.decode(token, secret_key, true, { algorithm: ALGORITHM })
      payload.with_indifferent_access
    rescue JWT::DecodeError => e
      raise DecodeError, e.message
    end

    private

    def secret_key
      ENV.fetch("JWT_SECRET_KEY") do
        Rails.application.credentials.secret_key_base ||
          Rails.application.secret_key_base
      end
    end
  end
end
