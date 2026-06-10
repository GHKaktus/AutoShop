require "test_helper"

module Api
  class AuthControllerTest < ActionDispatch::IntegrationTest
    setup do
      @password = "Sup3rSecret!"
      @account  = Account.create!(email: "user@example.com", password: @password)
    end

    test "POST /auth/sign-up creates account and returns token" do
      assert_difference "Account.count", 1 do
        post auth_sign_up_path, params: { email: "new@example.com", password: "Sup3rSecret!" }, as: :json
      end

      assert_response :created
      body = response.parsed_body
      assert body["token"].present?, "Expected a JWT in response"

      payload = JwtService.decode(body["token"])
      created = Account.find_by(email: "new@example.com")
      assert_equal created.id, payload[:sub]
      assert_equal "user", payload[:role]
    end

    test "POST /auth/sign-up returns 400 on duplicate email" do
      post auth_sign_up_path, params: { email: @account.email, password: "OtherPass1" }, as: :json

      assert_response :bad_request
      assert_equal "validation_error", response.parsed_body["error"]
    end

    test "POST /auth/sign-up returns 400 on short password" do
      post auth_sign_up_path, params: { email: "x@example.com", password: "123" }, as: :json

      assert_response :bad_request
      assert_equal "validation_error", response.parsed_body["error"]
    end

    test "POST /auth/sign-in returns token on valid credentials" do
      post auth_sign_in_path, params: { email: @account.email, password: @password }, as: :json

      assert_response :ok
      assert response.parsed_body["token"].present?
    end

    test "POST /auth/sign-in returns 401 on wrong password" do
      post auth_sign_in_path, params: { email: @account.email, password: "wrong" }, as: :json

      assert_response :unauthorized
      assert_equal "unauthorized", response.parsed_body["error"]
    end

    test "POST /auth/sign-in returns 401 on unknown email" do
      post auth_sign_in_path, params: { email: "ghost@example.com", password: @password }, as: :json

      assert_response :unauthorized
    end

    test "POST /auth/logout revokes token and rejects subsequent use" do
      token = JwtService.encode(account: @account)[:token]
      headers = { "Authorization" => "Bearer #{token}" }

      post auth_logout_path, headers: headers
      assert_response :ok
      assert JwtDenylist.exists?(jti: JwtService.decode(token)[:jti])

      post auth_logout_path, headers: headers
      assert_response :unauthorized
    end

    test "POST /auth/logout without token returns 401" do
      post auth_logout_path
      assert_response :unauthorized
    end

    test "POST /auth/forgot-password creates a reset code for existing user" do
      assert_difference "PasswordResetCode.count", 1 do
        post auth_forgot_password_path, params: { email: @account.email }, as: :json
      end

      assert_response :ok
      assert response.parsed_body["message"].present?
    end

    test "POST /auth/forgot-password returns 404 for unknown email" do
      assert_no_difference "PasswordResetCode.count" do
        post auth_forgot_password_path, params: { email: "ghost@example.com" }, as: :json
      end

      assert_response :not_found
      assert_equal "not_found", response.parsed_body["error"]
    end

    test "POST /auth/reset-password changes password and returns token" do
      post auth_forgot_password_path, params: { email: @account.email }, as: :json
      code = @account.password_reset_codes.last.code

      post auth_reset_password_path,
           params: { email: @account.email, code: code, new_password: "BrandNewPass1" },
           as: :json

      assert_response :ok
      assert response.parsed_body["token"].present?

      assert @account.reload.authenticate("BrandNewPass1")
      assert @account.password_reset_codes.active.none?
    end

    test "POST /auth/reset-password rejects invalid code" do
      post auth_forgot_password_path, params: { email: @account.email }, as: :json

      post auth_reset_password_path,
           params: { email: @account.email, code: "000000", new_password: "BrandNewPass1" },
           as: :json

      assert_response :bad_request
      assert_equal "validation_error", response.parsed_body["error"]
      assert @account.reload.authenticate(@password)
    end

    test "POST /auth/reset-password rejects expired code" do
      post auth_forgot_password_path, params: { email: @account.email }, as: :json
      reset_code = @account.password_reset_codes.last
      code = reset_code.code
      reset_code.update!(expires_at: 1.minute.ago)

      post auth_reset_password_path,
           params: { email: @account.email, code: code, new_password: "BrandNewPass1" },
           as: :json

      assert_response :bad_request
      assert_equal "validation_error", response.parsed_body["error"]
    end

    test "POST /auth/reset-password returns 400 on short password" do
      post auth_forgot_password_path, params: { email: @account.email }, as: :json
      code = @account.password_reset_codes.last.code

      post auth_reset_password_path,
           params: { email: @account.email, code: code, new_password: "123" },
           as: :json

      assert_response :bad_request
      assert_equal "validation_error", response.parsed_body["error"]
    end

    test "POST /auth/reset-password returns 404 for unknown email" do
      post auth_reset_password_path,
           params: { email: "ghost@example.com", code: "123456", new_password: "BrandNewPass1" },
           as: :json

      assert_response :not_found
    end
  end
end
