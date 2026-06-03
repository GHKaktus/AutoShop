require "test_helper"

module Api
  class BasketControllerTest < ActionDispatch::IntegrationTest
    setup do
      @account  = Account.create!(email: "buyer@example.com", password: "Sup3rSecret!")
      @category = Category.create!(name: "Тест", slug: "test", position: 1)
      @product  = Product.create!(category: @category, name: "Фильтр", cost: 500, stock: true)
      @other    = Product.create!(category: @category, name: "Свеча",  cost: 200, stock: true)
      @token    = JwtService.encode(account: @account)[:token]
      @headers  = { "Authorization" => "Bearer #{@token}" }
    end

    test "GET /basket requires authentication" do
      get basket_show_path
      assert_response :unauthorized
    end

    test "GET /basket returns empty items by default" do
      get basket_show_path, headers: @headers
      assert_response :success
      assert_equal({ "items" => [] }, response.parsed_body)
    end

    test "POST /basket adds new product" do
      post basket_create_path, params: { product_id: @product.id, quantity: 2 }, headers: @headers, as: :json
      assert_response :ok

      get basket_show_path, headers: @headers
      body = response.parsed_body
      assert_equal 1, body["items"].size
      assert_equal @product.id, body["items"][0]["product"]["id"]
      assert_equal 2, body["items"][0]["quantity"]
    end

    test "POST /basket increments quantity for existing product" do
      post basket_create_path, params: { product_id: @product.id, quantity: 1 }, headers: @headers, as: :json
      post basket_create_path, params: { product_id: @product.id, quantity: 3 }, headers: @headers, as: :json

      get basket_show_path, headers: @headers
      assert_equal 4, response.parsed_body["items"][0]["quantity"]
    end

    test "POST /basket returns 400 on invalid params" do
      post basket_create_path, params: { product_id: @product.id, quantity: 0 }, headers: @headers, as: :json
      assert_response :bad_request
      assert_equal "bad_request", response.parsed_body["error"]
    end

    test "POST /basket returns 404 when product missing" do
      post basket_create_path, params: { product_id: -1, quantity: 1 }, headers: @headers, as: :json
      assert_response :not_found
    end

    test "DELETE /basket/:id removes product line" do
      post basket_create_path, params: { product_id: @product.id, quantity: 1 }, headers: @headers, as: :json
      post basket_create_path, params: { product_id: @other.id,   quantity: 2 }, headers: @headers, as: :json

      delete basket_destroy_path(@product.id), headers: @headers
      assert_response :ok

      get basket_show_path, headers: @headers
      assert_equal 1, response.parsed_body["items"].size
      assert_equal @other.id, response.parsed_body["items"][0]["product"]["id"]
    end

    test "DELETE /basket/:id returns 404 if product not in basket" do
      delete basket_destroy_path(@product.id), headers: @headers
      assert_response :not_found
    end
  end
end
