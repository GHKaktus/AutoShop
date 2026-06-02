module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    attr_reader :current_account, :current_token_payload
  end

  def authenticate_account!
    payload = decoded_token
    return render_unauthorized("Неверный или отсутствующий токен") if payload.blank?

    if JwtDenylist.revoked?(payload[:jti])
      return render_unauthorized("Токен отозван")
    end

    account = Account.find_by(id: payload[:sub])
    return render_unauthorized("Пользователь не найден") if account.nil?

    @current_account       = account
    @current_token_payload = payload
  end

  def require_admin!
    return if current_account&.admin?

    render json: { error: "forbidden", message: "Доступ запрещён" }, status: :forbidden
  end

  private

  def decoded_token
    header = request.headers["Authorization"].to_s
    return nil unless header.start_with?("Bearer ")

    token = header.split(" ", 2).last.to_s.strip
    return nil if token.empty?

    JwtService.decode(token)
  rescue JwtService::DecodeError
    nil
  end

  def render_unauthorized(message)
    render json: { error: "unauthorized", message: message }, status: :unauthorized
  end
end
