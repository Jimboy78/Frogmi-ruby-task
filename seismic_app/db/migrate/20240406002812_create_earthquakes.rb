class CreateEarthquakes < ActiveRecord::Migration[7.1]
  def change
    create_table :earthquakes do |t|
      t.float :magnitude
      t.string :place
      t.bigint :time
      t.string :url
      t.integer :tsunami
      t.string :magType
      t.string :title
      t.float :longitude
      t.float :latitude
      t.float :depth

      t.timestamps
    end
  end
end
