class AddExternalIdToEarthquakes < ActiveRecord::Migration[7.1]
  def change
    add_column :earthquakes, :external_id, :string
    add_index :earthquakes, :external_id, unique: true
  end
end
