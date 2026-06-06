class ChangeOrdersTotalAmountAndDropAddress < ActiveRecord::Migration[8.1]
  def up
    # API 1.1.0: total_amount — number (float)
    change_column :orders, :total_amount, :decimal, precision: 12, scale: 2, null: false, default: 0

    # API 1.1.0: поле address удалено из схемы Order (на фронте нет ввода адреса)
    remove_column :orders, :address
  end

  def down
    add_column :orders, :address, :string
    change_column :orders, :total_amount, :integer, null: false, default: 0
  end
end
