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

    def forgot_password
      account = find_account_by_email(params[:email])
      return render_user_not_found unless account

      reset_code = account.issue_password_reset_code!
      PasswordResetMailer.with(account: account, code: reset_code.code)
                         .reset_code_email
                         .deliver_later

      render json: { message: "Код восстановления отправлен на вашу почту" }, status: :ok
    end

    def reset_password
      account = find_account_by_email(params[:email])
      return render_user_not_found unless account

      reset_code = account.password_reset_codes.active.find_by(code: params[:code].to_s)
      unless reset_code
        return render_error(
          error:   "validation_error",
          message: "Неверный или просроченный код восстановления",
          status:  :bad_request
        )
      end

      account.password = params[:new_password]

      if account.save
        reset_code.consume!
        account.password_reset_codes.active.update_all(consumed_at: Time.current)
        token = JwtService.encode(account: account)
        render json: { token: token[:token] }, status: :ok
      else
        render_validation_error(account)
      end
    end

    private

    def account_params
      params.permit(:email, :password)
    end

    def find_account_by_email(email)
      Account.find_by("LOWER(email) = ?", email.to_s.strip.downcase)
    end

    def render_user_not_found
      render_error(
        error:   "not_found",
        message: "Пользователь с таким email не найден",
        status:  :not_found
      )
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
