class ChangeProductsMoneyAndStock < ActiveRecord::Migration[8.1]
  def up
    # API 1.1.0: cost/sale_cost — number (float) для поддержки копеек
    change_column :products, :cost,      :decimal, precision: 12, scale: 2, null: false
    change_column :products, :sale_cost, :decimal, precision: 12, scale: 2, null: false, default: -1

    # API 1.1.0: stock — integer (количество единиц на складе) вместо boolean (наличие)
    execute <<~SQL.squish
      ALTER TABLE products
        ALTER COLUMN stock DROP DEFAULT,
        ALTER COLUMN stock TYPE integer USING (CASE WHEN stock THEN 1 ELSE 0 END),
        ALTER COLUMN stock SET DEFAULT 0;
    SQL
    change_column_null :products, :stock, false

    add_check_constraint :products, "stock >= 0", name: "products_stock_non_negative"
  end

  def down
    remove_check_constraint :products, name: "products_stock_non_negative"

    execute <<~SQL.squish
      ALTER TABLE products
        ALTER COLUMN stock DROP DEFAULT,
        ALTER COLUMN stock TYPE boolean USING (CASE WHEN stock > 0 THEN true ELSE false END),
        ALTER COLUMN stock SET DEFAULT true;
    SQL
    change_column_null :products, :stock, false

    change_column :products, :cost,      :integer, null: false
    change_column :products, :sale_cost, :integer, null: false, default: -1
  end
end
