namespace :usgs do
  desc 'Fetch earthquake data from USGS and update database'
  task fetch_data: :environment do
    require 'httparty'
    require 'date'

    url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
    begin
      response = HTTParty.get(url)
      raise "Failed to retrieve data: #{response.code} #{response.message}" unless response.success?

      data = response.parsed_response
      data['features'].each do |feature|
        next unless feature['properties']['mag'] && feature['geometry']['coordinates'] # Ensure necessary data is present

        earthquake = Earthquake.find_or_initialize_by(external_id: feature['id'])
        earthquake.assign_attributes(
          magnitude: feature['properties']['mag'],
          place: feature['properties']['place'],
          time: Time.at(feature['properties']['time'] / 1000.0).to_datetime,
          url: feature['properties']['url'],
          tsunami: feature['properties']['tsunami'],
          magType: feature['properties']['magType'],
          title: feature['properties']['title'],
          longitude: feature['geometry']['coordinates'][0],
          latitude: feature['geometry']['coordinates'][1],
          depth: feature['geometry']['coordinates'][2]
        )

        if earthquake.changed?
          if earthquake.save
            puts "Earthquake #{earthquake.external_id} updated or created."
          else
            puts "Failed to save earthquake #{earthquake.external_id}: #{earthquake.errors.full_messages.join(', ')}"
          end
        end
      end

      puts "Data update complete. Total entries updated: #{data['features'].size}"
    rescue StandardError => e
      puts "An error occurred: #{e.message}"
    end
  end
end
