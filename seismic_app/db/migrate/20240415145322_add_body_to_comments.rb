class AddBodyToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :body, :text
  end
end
