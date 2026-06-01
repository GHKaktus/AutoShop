class CreateBasketItems < ActiveRecord::Migration[8.1]
  def change
    create_table :basket_items do |t|
      t.references :basket,   null: false, foreign_key: true
      t.references :product,  null: false, foreign_key: true
      t.integer    :quantity, null: false, default: 1

      t.timestamps
    end

    add_index :basket_items, %i[basket_id product_id], unique: true
    add_check_constraint :basket_items, "quantity > 0", name: "basket_items_quantity_positive"
  end
end
