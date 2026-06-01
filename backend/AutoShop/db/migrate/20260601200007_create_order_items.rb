class CreateOrderItems < ActiveRecord::Migration[8.1]
  def change
    create_table :order_items do |t|
      t.references :order,    null: false, foreign_key: true
      t.references :product,  foreign_key: true
      t.string     :name,     null: false
      t.integer    :quantity, null: false
      t.integer    :cost,     null: false

      t.timestamps
    end

    add_check_constraint :order_items, "quantity > 0", name: "order_items_quantity_positive"
    add_check_constraint :order_items, "cost >= 0",    name: "order_items_cost_non_negative"
  end
end
