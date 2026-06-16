# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_16_192747) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_accounts_on_lower_email", unique: true
    t.index ["role"], name: "index_accounts_on_role"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "basket_items", force: :cascade do |t|
    t.bigint "basket_id", null: false
    t.datetime "created_at", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", default: 1, null: false
    t.datetime "updated_at", null: false
    t.index ["basket_id", "product_id"], name: "index_basket_items_on_basket_id_and_product_id", unique: true
    t.index ["basket_id"], name: "index_basket_items_on_basket_id"
    t.index ["product_id"], name: "index_basket_items_on_product_id"
    t.check_constraint "quantity > 0", name: "basket_items_quantity_positive"
  end

  create_table "baskets", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_baskets_on_account_id", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image"
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_categories_on_position"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "jti", null: false
    t.datetime "updated_at", null: false
    t.index ["expires_at"], name: "index_jwt_denylist_on_expires_at"
    t.index ["jti"], name: "index_jwt_denylist_on_jti", unique: true
  end

  create_table "order_items", force: :cascade do |t|
    t.decimal "cost", precision: 12, scale: 2, null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "order_id", null: false
    t.bigint "product_id"
    t.integer "quantity", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
    t.check_constraint "cost >= 0::numeric", name: "order_items_cost_non_negative"
    t.check_constraint "quantity > 0", name: "order_items_quantity_positive"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.text "comment"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "phone", null: false
    t.integer "status", default: 0, null: false
    t.decimal "total_amount", precision: 12, scale: 2, default: "0.0", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_orders_on_account_id"
    t.index ["created_at"], name: "index_orders_on_created_at"
    t.index ["status"], name: "index_orders_on_status"
    t.check_constraint "total_amount >= 0::numeric", name: "orders_total_amount_non_negative"
  end

  create_table "password_reset_codes", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "code", null: false
    t.datetime "consumed_at"
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id", "code"], name: "index_password_reset_codes_on_account_id_and_code"
    t.index ["account_id"], name: "index_password_reset_codes_on_account_id"
    t.index ["expires_at"], name: "index_password_reset_codes_on_expires_at"
  end

  create_table "products", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.decimal "cost", precision: 12, scale: 2, null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name", null: false
    t.string "picture"
    t.decimal "sale_cost", precision: 12, scale: 2, default: "-1.0", null: false
    t.integer "stock", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["name"], name: "index_products_on_name"
    t.index ["stock"], name: "index_products_on_stock"
    t.check_constraint "stock >= 0", name: "products_stock_non_negative"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "basket_items", "baskets"
  add_foreign_key "basket_items", "products"
  add_foreign_key "baskets", "accounts"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "accounts"
  add_foreign_key "password_reset_codes", "accounts"
  add_foreign_key "products", "categories"
end
