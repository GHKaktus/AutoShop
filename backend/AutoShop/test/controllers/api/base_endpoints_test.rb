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
          stock: 10,
          description: "Описание #{idx}"
        )
      end

      Product.create!(
        category: @other_category,
        name: "Масло синтетическое",
        cost: 999.50,
        sale_cost: 899.99,
        stock: 5
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
      assert_equal product.cost.to_f, body["cost"]
      assert_kind_of Integer, body["stock"]
    end

    test "GET /products/:id returns 404 for unknown product" do
      get product_path(-1), as: :json
      assert_response :not_found
    end

    test "GET /categories returns all categories" do
      get categories_path, as: :json

      assert_response :success
      body = response.parsed_body
      assert_kind_of Array, body
      assert_equal 2, body.size
      assert(body.all? { |c| c.key?("id") && c.key?("name") && c.key?("description") })
    end

    test "GET /catalog/:id filters by in_stock" do
      cat = Category.create!(name: "Фильтр-кат", slug: "filter-cat", position: 5)
      Product.create!(category: cat, name: "Есть",  cost: 100, stock: 5)
      Product.create!(category: cat, name: "Нет",   cost: 200, stock: 0)

      get catalog_path(cat.id), params: { in_stock: "in_stock" }, as: :json
      assert_response :success
      assert_equal 1, response.parsed_body["total_items"]
      assert_equal "Есть", response.parsed_body["items"][0]["name"]

      get catalog_path(cat.id), params: { in_stock: "out_of_stock" }, as: :json
      assert_equal 1, response.parsed_body["total_items"]
      assert_equal "Нет", response.parsed_body["items"][0]["name"]

      get catalog_path(cat.id), params: { in_stock: "all" }, as: :json
      assert_equal 2, response.parsed_body["total_items"]
    end

    test "GET /catalog/:id filters by price range using effective price" do
      cat = Category.create!(name: "Цена-кат", slug: "price-cat", position: 6)
      Product.create!(category: cat, name: "Дешёвый",  cost: 100, stock: 5)
      Product.create!(category: cat, name: "Средний",  cost: 500, stock: 5)
      Product.create!(category: cat, name: "Скидочный", cost: 1000, sale_cost: 300, stock: 5)

      get catalog_path(cat.id), params: { price_min: 200, price_max: 600 }, as: :json
      assert_response :success
      names = response.parsed_body["items"].map { |p| p["name"] }
      assert_equal %w[Средний Скидочный].sort, names.sort
    end

    test "GET /catalog/:id sorts by price asc and desc" do
      cat = Category.create!(name: "Сорт-кат", slug: "sort-cat", position: 7)
      Product.create!(category: cat, name: "A", cost: 300, stock: 5)
      Product.create!(category: cat, name: "B", cost: 100, stock: 5)
      Product.create!(category: cat, name: "C", cost: 200, stock: 5)

      get catalog_path(cat.id), params: { sort_by: "price_asc" }, as: :json
      assert_equal %w[B C A], response.parsed_body["items"].map { |p| p["name"] }

      get catalog_path(cat.id), params: { sort_by: "price_desc" }, as: :json
      assert_equal %w[A C B], response.parsed_body["items"].map { |p| p["name"] }
    end

    test "GET /catalog/:id sorts by status (in stock first)" do
      cat = Category.create!(name: "Статус-кат", slug: "status-cat", position: 8)
      Product.create!(category: cat, name: "Нет",  cost: 100, stock: 0)
      Product.create!(category: cat, name: "Есть", cost: 200, stock: 3)

      get catalog_path(cat.id), params: { sort_by: "status" }, as: :json
      assert_equal "Есть", response.parsed_body["items"][0]["name"]
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
