module Api
  class AuthController < BaseController
    before_action :authenticate_account!, only: :logout

    def sign_up
      account = Account.new(account_params)

      if account.save
        token = JwtService.encode(account: account)
        render json: { token: token[:token] }, status: :created
      else
        render_validation_error(account)
      end
    end

    def sign_in
      account = Account.find_by("LOWER(email) = ?", params[:email].to_s.strip.downcase)

      # Метод 'authenticate' предоставляется методом 'has_secure_password' из модели Account.

      if account&.authenticate(params[:password])
        token = JwtService.encode(account: account)
        render json: { token: token[:token] }, status: :ok
      else
        render_error(
          error:   "unauthorized",
          message: "Неверный email или пароль",
          status:  :unauthorized
        )
      end
    end

    def logout
      JwtDenylist.revoke!(
        jti:        current_token_payload[:jti],
        expires_at: Time.at(current_token_payload[:exp].to_i)
      )
      head :ok
    rescue ActiveRecord::RecordNotUnique
      head :ok
    end

    private

    def account_params
      params.permit(:email, :password)
    end

    def render_validation_error(account)
      render_error(
        error:   "validation_error",
        message: account.errors.full_messages.first || "Неверные данные",
        status:  :bad_request
      )
    end
  end
end
