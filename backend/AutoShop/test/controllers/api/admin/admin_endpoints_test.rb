require "test_helper"

module Api
  module Admin
    class AdminEndpointsTest < ActionDispatch::IntegrationTest
      setup do
        @category = Category.create!(name: "Каталог", slug: "katalog", position: 1)

        @admin = Account.create!(email: "admin@example.com", password: "Sup3rSecret!", role: :admin)
        @user  = Account.create!(email: "user@example.com",  password: "Sup3rSecret!", role: :user)

        @product = Product.create!(category: @category, name: "Фильтр", cost: 500, stock: true)

        order = @user.orders.new(
          name: "Иван", phone: "+79161234567", email: "ivan@example.com",
          address: "г. Москва", total_amount: 500, status: :pending
        )
        order.order_items.build(product: @product, name: @product.name, cost: @product.cost, quantity: 1)
        order.save!

        @admin_headers = { "Authorization" => "Bearer #{JwtService.encode(account: @admin)[:token]}" }
        @user_headers  = { "Authorization" => "Bearer #{JwtService.encode(account: @user)[:token]}" }
      end

      test "admin endpoints return 401 without token" do
        get admin_orders_path, as: :json
        assert_response :unauthorized
      end

      test "admin endpoints return 403 for non-admin user" do
        get admin_orders_path, headers: @user_headers, as: :json
        assert_response :forbidden
        assert_equal "forbidden", response.parsed_body["error"]
      end

      test "GET /admin/orders returns paginated orders" do
        get admin_orders_path, headers: @admin_headers, as: :json

        assert_response :success
        body = response.parsed_body
        assert_equal 1, body["total_orders"]
        assert_equal 0, body["current_page"]
        assert_equal 20, body["page_size"]
        assert_equal 1, body["orders"].size
        assert_equal @user.id, body["orders"][0]["user_id"]
      end

      test "DELETE /admin/orders removes all orders" do
        delete admin_orders_path, headers: @admin_headers, as: :json

        assert_response :success
        assert_equal 1, response.parsed_body["deleted_count"]
        assert_equal 0, Order.count
      end

      test "GET /admin/users returns paginated accounts" do
        get admin_users_path, headers: @admin_headers, as: :json

        assert_response :success
        body = response.parsed_body
        assert_equal 2, body["total_users"]
        assert_equal 2, body["users"].size
        assert body["users"].any? { |a| a["role"] == "admin" }
      end

      test "DELETE /admin/users removes all accounts" do
        delete admin_users_path, headers: @admin_headers, as: :json

        assert_response :success
        assert_equal 2, response.parsed_body["deleted_count"]
        assert_equal 0, Account.count
      end

      test "GET /admin/products returns paginated products" do
        get admin_products_path, headers: @admin_headers, as: :json

        assert_response :success
        body = response.parsed_body
        assert_equal 1, body["total_products"]
        assert_equal @product.id, body["products"][0]["id"]
      end

      test "POST /admin/products creates product" do
        assert_difference "Product.count", 1 do
          post admin_products_path,
               params:  {
                 name: "Масло", cost: 900, sale_cost: -1, stock: true,
                 category_id: @category.id, description: "5W-30"
               },
               headers: @admin_headers,
               as:      :json
        end

        assert_response :created
        assert_equal "Масло", response.parsed_body["name"]
      end

      test "POST /admin/products returns 400 on invalid data" do
        post admin_products_path,
             params:  { name: "", cost: -1, category_id: @category.id },
             headers: @admin_headers,
             as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end
    end
  end
end
