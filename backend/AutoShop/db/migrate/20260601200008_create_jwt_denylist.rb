class CreateJwtDenylist < ActiveRecord::Migration[8.1]
  def change
    create_table :jwt_denylist do |t|
      t.string   :jti,        null: false
      t.datetime :expires_at, null: false

      t.timestamps
    end

    add_index :jwt_denylist, :jti, unique: true
    add_index :jwt_denylist, :expires_at
  end
end
