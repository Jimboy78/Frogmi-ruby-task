module Api
  module V1
    class CommentsController < ApplicationController
      before_action :set_earthquake

      def index
        if @earthquake
          comments = @earthquake.comments.order(created_at: :desc)
          render json: comments
        else
          render json: { error: "Earthquake not found" }, status: :not_found
        end
      end

      def create
        return render json: { error: "Earthquake not found" }, status: :not_found if @earthquake.nil?

        comment = @earthquake.comments.build(comment_params)
        if comment.save
          render json: comment, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "Failed to create comment: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end

      private

      def set_earthquake
        @earthquake = Earthquake.find_by(id: params[:earthquake_id])
      end

      def comment_params
        params.require(:comment).permit(:body)
      end
    end
  end
end