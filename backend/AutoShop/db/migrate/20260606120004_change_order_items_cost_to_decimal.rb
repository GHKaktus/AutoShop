class ChangeOrderItemsCostToDecimal < ActiveRecord::Migration[8.1]
  def up
    # Снапшот цены позиции заказа — number (float), согласованно с Product#cost
    change_column :order_items, :cost, :decimal, precision: 12, scale: 2, null: false
  end

  def down
    change_column :order_items, :cost, :integer, null: false
  end
end
