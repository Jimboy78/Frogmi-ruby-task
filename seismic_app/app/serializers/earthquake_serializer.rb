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
  attributes :id, :magnitude, :place, :time, :url, :tsunami, :magType, :title, :longitude, :latitude, :depth
  attribute :external_url do
    object.url
  end
  
  def time
    Time.at(object.time).utc.strftime("%Y-%m-%d %H:%M:%S") if object.time
  end
end
