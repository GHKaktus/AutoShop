class CreateAccounts < ActiveRecord::Migration[8.1]
  def change
    create_table :accounts do |t|
      t.string  :email,           null: false
      t.string  :password_digest, null: false
      t.integer :role,            null: false, default: 0

      t.timestamps
    end

    add_index :accounts, "LOWER(email)", unique: true, name: "index_accounts_on_lower_email"
    add_index :accounts, :role
  end
end
