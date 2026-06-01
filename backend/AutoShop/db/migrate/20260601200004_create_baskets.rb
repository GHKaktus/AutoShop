class CreateBaskets < ActiveRecord::Migration[8.1]
  def change
    create_table :baskets do |t|
      t.references :account, null: false, foreign_key: true, index: { unique: true }

      t.timestamps
    end
  end
end
