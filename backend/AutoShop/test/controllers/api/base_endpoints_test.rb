require "test_helper"

module Api
  class BaseEndpointsTest < ActionDispatch::IntegrationTest
    setup do
      @category = Category.create!(name: "Тестовая", slug: "testovaya", position: 1)
      @other_category = Category.create!(name: "Другая", slug: "drugaya", position: 2)

      25.times do |idx|
        Product.create!(
          category: @category,
          name: "Фильтр #{idx}",
          cost: 100 + idx,
          sale_cost: -1,
          stock: true,
          description: "Описание #{idx}"
        )
      end

      Product.create!(
        category: @other_category,
        name: "Масло синтетическое",
        cost: 999,
        sale_cost: 899,
        stock: true
      )
    end

    test "GET /catalog/:id returns paginated products" do
      get catalog_path(@category.id), as: :json

      assert_response :success
      body = response.parsed_body
      assert_equal 25, body["total_items"]
      assert_equal 0, body["current_page"]
      assert_equal 20, body["page_size"]
      assert_equal 20, body["items"].size
    end

    test "GET /catalog/:id supports page param" do
      get catalog_path(@category.id), params: { page: 1 }, as: :json

      assert_response :success
      assert_equal 5, response.parsed_body["items"].size
      assert_equal 1, response.parsed_body["current_page"]
    end

    test "GET /catalog/:id returns 404 for missing category" do
      get catalog_path(-1), as: :json
      assert_response :not_found
      assert_equal "not_found", response.parsed_body["error"]
    end

    test "GET /products/:id returns product" do
      product = Product.first

      get product_path(product.id), as: :json

      assert_response :success
      body = response.parsed_body
      assert_equal product.id, body["id"]
      assert_equal product.name, body["name"]
      assert_equal product.cost, body["cost"]
    end

    test "GET /products/:id returns 404 for unknown product" do
      get product_path(-1), as: :json
      assert_response :not_found
    end

    test "GET /search returns results by query" do
      get search_path, params: { q: "масло" }, as: :json

      assert_response :success
      body = response.parsed_body
      assert_equal 1, body["total_items"]
      assert_equal "Масло синтетическое", body["items"][0]["name"]
    end

    test "GET /search returns 404 when no products found" do
      get search_path, params: { q: "неттакоготовара" }, as: :json
      assert_response :not_found
      assert_equal "not_found", response.parsed_body["error"]
    end

    test "GET /search returns 400 when query is missing" do
      get search_path, as: :json
      assert_response :bad_request
      assert_equal "bad_request", response.parsed_body["error"]
    end
  end
end
