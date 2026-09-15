module Api
  module V1
    class EarthquakesController < ApplicationController
      def index
        earthquakes = Earthquake.order(time: :desc)
        earthquakes = earthquakes.where("magnitude >= ?", params[:min_magnitude].to_f) if params[:min_magnitude].present?
        earthquakes = earthquakes.page(params[:page]).per(params[:per_page] || 100)

        render json: {
          earthquakes: ActiveModelSerializers::SerializableResource.new(earthquakes).as_json,
          pagination: pagination_meta(earthquakes)
        }, status: :ok
      end

      # Accepts either the internal id or the USGS event id (external_id).
      def show
        earthquake = Earthquake.find_by(id: params[:id]) || Earthquake.find_by(external_id: params[:id])
        if earthquake
          render json: earthquake, include: [:comments]
        else
          render json: { error: "Not Found" }, status: :not_found
        end
      end

      private

      def pagination_meta(earthquakes)
        {
          current_page: earthquakes.current_page,
          next_page: earthquakes.next_page,
          prev_page: earthquakes.prev_page,
          total_pages: earthquakes.total_pages,
          total_count: earthquakes.total_count
        }
      end
    end
  end
end
