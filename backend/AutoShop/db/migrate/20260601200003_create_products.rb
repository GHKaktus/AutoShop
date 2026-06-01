class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string     :name,        null: false
      t.integer    :cost,        null: false
      t.integer    :sale_cost,   null: false, default: -1
      t.string     :picture
      t.text       :description
      t.boolean    :stock,       null: false, default: true
      t.references :category,    null: false, foreign_key: true

      t.timestamps
    end

    add_index :products, :name
    add_index :products, :stock
  end
end
