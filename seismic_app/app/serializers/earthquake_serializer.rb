# == Schema Information
#
# Table name: earthquakes
#
#  id          :bigint           not null, primary key
#  depth       :float
#  latitude    :float
#  longitude   :float
#  magType     :string
#  magnitude   :float
#  place       :string
#  time        :bigint
#  title       :string
#  tsunami     :integer
#  url         :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string
#
# Indexes
#
#  index_earthquakes_on_external_id  (external_id) UNIQUE
#
class EarthquakeSerializer < ActiveModel::Serializer
  attributes :id, :external_id, :magnitude, :place, :time, :url, :tsunami, :magType, :title, :longitude, :latitude, :depth

  # Stored as epoch milliseconds (same unit as the USGS feed); also expose ISO 8601 for convenience.
  attribute :time_iso do
    Time.at(object.time / 1000.0).utc.iso8601 if object.time
  end
end
