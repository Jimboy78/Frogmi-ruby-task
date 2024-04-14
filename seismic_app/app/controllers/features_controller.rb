class FeaturesController < ApplicationController
  def index
    earthquakes = Earthquake.order(created_at: :desc)
    earthquakes = earthquakes.page(params[:page]).per(params[:per_page] || 20)  # Default to 20 per page if not specified

    render json: {
      earthquakes: ActiveModelSerializers::SerializableResource.new(earthquakes).as_json,
      pagination: pagination_meta(earthquakes)
    }, status: :ok
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
