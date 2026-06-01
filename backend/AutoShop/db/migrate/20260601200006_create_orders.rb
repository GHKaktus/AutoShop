class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :account,      null: false, foreign_key: true
      t.string     :name,         null: false
      t.string     :phone,        null: false
      t.string     :email,        null: false
      t.text       :comment
      t.string     :address,      null: false
      t.integer    :status,       null: false, default: 0
      t.integer    :total_amount, null: false, default: 0

      t.timestamps
    end

    add_index :orders, :status
    add_index :orders, :created_at
    add_check_constraint :orders, "total_amount >= 0", name: "orders_total_amount_non_negative"
  end
end
