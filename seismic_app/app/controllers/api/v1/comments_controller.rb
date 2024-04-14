module Api
  module V1
    class CommentsController < ApplicationController
      before_action :set_earthquake, only: [:create]

      def create
        if @earthquake.nil?
          render json: { error: "Earthquake not found" }, status: :not_found
          return
        end

        @comment = @earthquake.comments.build(comment_params)
        if @comment.save
          render json: @comment, status: :created
        else
          render json: @comment.errors, status: :unprocessable_entity
        end
      end

      private

      def set_earthquake
        @earthquake = Earthquake.find_by(id: params[:feature_id])
      end

      def comment_params
        params.require(:comment).permit(:body)
      end
    end
  end
end
