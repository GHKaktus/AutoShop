require "test_helper"

module Api
  module Basket
    class OrdersControllerTest < ActionDispatch::IntegrationTest
      setup do
        @account  = Account.create!(email: "orderer@example.com", password: "Sup3rSecret!")
        @category = Category.create!(name: "Тест", slug: "test", position: 1)
        @product1 = Product.create!(category: @category, name: "Фильтр", cost: 500, sale_cost: 450, stock: true)
        @product2 = Product.create!(category: @category, name: "Свеча",  cost: 200, stock: true)
        @token    = JwtService.encode(account: @account)[:token]
        @headers  = { "Authorization" => "Bearer #{@token}" }

        basket = @account.basket || @account.create_basket!
        basket.basket_items.create!(product: @product1, quantity: 2)
        basket.basket_items.create!(product: @product2, quantity: 3)
      end

      test "POST /basket/order requires authentication" do
        post basket_order_path
        assert_response :unauthorized
      end

      test "POST /basket/order creates order, returns summary and clears basket" do
        assert_difference "Order.count", 1 do
          post basket_order_path,
               params:  { name: "Иван", phone: "+79161234567", email: "ivan@example.com", comment: "Срочно" },
               headers: @headers,
               as:      :json
        end

        assert_response :created
        body = response.parsed_body

        assert body["order_id"].present?
        assert_equal 1500, body["total_amount"]
        assert_equal "Заказ принят. С вами свяжутся для подтверждения.", body["message"]

        order = Order.find(body["order_id"])
        assert_equal 2, order.order_items.count
        assert_equal "Иван", order.name
        assert_equal "Срочно", order.comment

        assert_equal 0, @account.basket.reload.basket_items.count
      end

      test "POST /basket/order returns 400 when basket is empty" do
        @account.basket.clear!

        post basket_order_path,
             params:  { name: "Иван", phone: "+79161234567", email: "ivan@example.com" },
             headers: @headers,
             as:      :json

        assert_response :bad_request
        assert_equal "Корзина пуста", response.parsed_body["message"]
      end

      test "POST /basket/order returns 400 on invalid form" do
        post basket_order_path,
             params:  { name: "И", phone: "abc", email: "ivan@example.com" },
             headers: @headers,
             as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end
    end
  end
end
