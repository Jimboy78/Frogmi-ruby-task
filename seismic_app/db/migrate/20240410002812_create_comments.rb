class CreateComments < ActiveRecord::Migration[7.0]  # make sure to use the correct version
  def change
    create_table :comments do |t|
      t.text :content
      t.references :feature, null: false, foreign_key: true

      t.timestamps
    end
  end
end
