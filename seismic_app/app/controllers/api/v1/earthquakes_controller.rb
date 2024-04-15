module Api
    module V1
      class EarthquakesController < ApplicationController
        def index
          earthquakes = Earthquake.order(created_at: :desc)
          earthquakes = earthquakes.page(params[:page]).per(params[:per_page] || 100)
      
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


        def show
          earthquake = Earthquake.find_by(id: params[:id])
          if earthquake
            render json: earthquake, include: [:comments]
          else
            render json: { error: "Not Found" }, status: :not_found
          end
        end
        

        def create_comment
          comment = Comment.new(comment_params)
          if comment.save
            render json: comment, status: :created
          else
            render json: comment.errors, status: :unprocessable_entity
          end
        end
        
        private
        
        def comment_params
          params.require(:comment).permit(:body).merge(feature_id: params[:feature_id])
        end

      end
    end
  end
  