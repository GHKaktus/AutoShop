class PasswordResetMailer < ApplicationMailer
  def reset_code_email
    @account = params[:account]
    @code    = params[:code]

    mail(to: @account.email, subject: "Восстановление пароля AutoShop")
  end
end
