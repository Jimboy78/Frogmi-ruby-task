module Api
    module V1
      class EarthquakesController < ApplicationController
        def index
          earthquakes = Earthquake.all.order(created_at: :desc)
          earthquakes = earthquakes.where(magType: params[:filters][:mag_type]) if params[:filters]&.dig(:mag_type)
          earthquakes = paginate(earthquakes, params[:page], params[:per_page])
  
          render json: EarthquakeSerializer.new(earthquakes).serialized_json
        end
  
        private
  
        def paginate(items, page, per_page)
          per_page = [per_page.to_i, 1000].min
          items.paginate(page: page, per_page: per_page)
        end
      end
    end
  end