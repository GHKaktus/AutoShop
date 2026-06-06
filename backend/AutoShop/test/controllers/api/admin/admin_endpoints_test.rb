require "test_helper"

module Api
  module Admin
    class AdminEndpointsTest < ActionDispatch::IntegrationTest
      setup do
        @category = Category.create!(name: "Каталог", slug: "katalog", position: 1)

        @admin = Account.create!(email: "admin@example.com", password: "Sup3rSecret!", role: :admin)
        @user  = Account.create!(email: "user@example.com",  password: "Sup3rSecret!", role: :user)

        @product = Product.create!(category: @category, name: "Фильтр", cost: 500, stock: 10)

        order = @user.orders.new(
          name: "Иван", phone: "+79161234567", email: "ivan@example.com",
          total_amount: 500, status: :pending
        )
        order.order_items.build(product: @product, name: @product.name, cost: @product.cost, quantity: 1)
        order.save!
        @order = order

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
                 name: "Масло", cost: 900.50, sale_cost: -1, stock: 7,
                 category_id: @category.id, description: "5W-30"
               },
               headers: @admin_headers,
               as:      :json
        end

        assert_response :created
        body = response.parsed_body
        assert_equal "Масло", body["name"]
        assert_equal 900.5, body["cost"]
        assert_equal 7, body["stock"]
      end

      test "POST /admin/products returns 400 on invalid data" do
        post admin_products_path,
             params:  { name: "", cost: -1, category_id: @category.id },
             headers: @admin_headers,
             as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "GET /admin/products/:id returns product" do
        get admin_product_path(@product.id), headers: @admin_headers, as: :json

        assert_response :success
        assert_equal @product.id, response.parsed_body["id"]
      end

      test "GET /admin/products/:id returns 404 for unknown product" do
        get admin_product_path(-1), headers: @admin_headers, as: :json
        assert_response :not_found
      end

      test "PUT /admin/products/:id updates product" do
        put admin_product_path(@product.id),
            params:  { cost: 750.25, stock: 3 },
            headers: @admin_headers,
            as:      :json

        assert_response :success
        body = response.parsed_body
        assert_equal 750.25, body["cost"]
        assert_equal 3, body["stock"]
      end

      test "PUT /admin/products/:id returns 400 on invalid data" do
        put admin_product_path(@product.id),
            params:  { cost: -5 },
            headers: @admin_headers,
            as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "DELETE /admin/products/:id removes product" do
        assert_difference "Product.count", -1 do
          delete admin_product_path(@product.id), headers: @admin_headers, as: :json
        end
        assert_response :ok
      end

      test "GET /admin/orders/:id returns order" do
        get admin_order_path(@order.id), headers: @admin_headers, as: :json

        assert_response :success
        body = response.parsed_body
        assert_equal @order.id, body["id"]
        assert_equal "pending", body["status"]
        assert_not body.key?("address")
      end

      test "PUT /admin/orders/:id updates status" do
        put admin_order_path(@order.id),
            params:  { status: "shipped" },
            headers: @admin_headers,
            as:      :json

        assert_response :success
        assert_equal "shipped", response.parsed_body["status"]
        assert_equal "shipped", @order.reload.status
      end

      test "PUT /admin/orders/:id returns 400 on invalid status" do
        put admin_order_path(@order.id),
            params:  { status: "unknown" },
            headers: @admin_headers,
            as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "DELETE /admin/orders/:id removes single order" do
        assert_difference "Order.count", -1 do
          delete admin_order_path(@order.id), headers: @admin_headers, as: :json
        end
        assert_response :ok
      end

      test "PUT /admin/users/:id/role changes role" do
        put admin_user_role_path(@user.id),
            params:  { role: "admin" },
            headers: @admin_headers,
            as:      :json

        assert_response :success
        assert_equal "admin", response.parsed_body["role"]
        assert @user.reload.admin?
      end

      test "PUT /admin/users/:id/role returns 400 on invalid role" do
        put admin_user_role_path(@user.id),
            params:  { role: "superuser" },
            headers: @admin_headers,
            as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "PUT /admin/users/:id/role returns 404 for unknown user" do
        put admin_user_role_path(-1),
            params:  { role: "admin" },
            headers: @admin_headers,
            as:      :json

        assert_response :not_found
      end

      test "POST /admin/categories creates category" do
        assert_difference "Category.count", 1 do
          post admin_categories_path,
               params:  { name: "Тормоза", description: "Тормозные системы" },
               headers: @admin_headers,
               as:      :json
        end

        assert_response :created
        body = response.parsed_body
        assert_equal "Тормоза", body["name"]
        assert_equal "Тормозные системы", body["description"]
      end

      test "POST /admin/categories returns 400 on invalid data" do
        post admin_categories_path,
             params:  { name: "" },
             headers: @admin_headers,
             as:      :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "GET /admin/categories/:id returns category" do
        get admin_category_path(@category.id), headers: @admin_headers, as: :json

        assert_response :success
        assert_equal @category.id, response.parsed_body["id"]
      end

      test "PUT /admin/categories/:id updates category" do
        put admin_category_path(@category.id),
            params:  { name: "Каталог 2", description: "Обновлено" },
            headers: @admin_headers,
            as:      :json

        assert_response :success
        assert_equal "Каталог 2", response.parsed_body["name"]
        assert_equal "Обновлено", response.parsed_body["description"]
      end

      test "DELETE /admin/categories/:id removes empty category" do
        empty = Category.create!(name: "Пустая", slug: "pustaya", position: 9)

        assert_difference "Category.count", -1 do
          delete admin_category_path(empty.id), headers: @admin_headers, as: :json
        end
        assert_response :ok
      end

      test "DELETE /admin/categories/:id returns 400 when category has products" do
        delete admin_category_path(@category.id), headers: @admin_headers, as: :json

        assert_response :bad_request
        assert_equal "validation_error", response.parsed_body["error"]
      end

      test "admin CRUD endpoints reject non-admin" do
        get admin_product_path(@product.id), headers: @user_headers, as: :json
        assert_response :forbidden
      end
    end
  end
end
