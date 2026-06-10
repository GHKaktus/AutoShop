class CreatePasswordResetCodes < ActiveRecord::Migration[8.1]
  def change
    create_table :password_reset_codes do |t|
      t.references :account, null: false, foreign_key: true
      t.string   :code, null: false
      t.datetime :expires_at, null: false
      t.datetime :consumed_at

      t.timestamps
    end

    add_index :password_reset_codes, %i[account_id code]
    add_index :password_reset_codes, :expires_at
  end
end
