class EarthquakeSerializer < ActiveModel::Serializer
  attributes :id, :magnitude, :place, :time, :url, :tsunami, :magType, :title, :longitude, :latitude, :depth
  attribute :external_url do
    object.url
  end
  
  def time
    Time.at(object.time).utc.strftime("%Y-%m-%d %H:%M:%S") if object.time
  end
end