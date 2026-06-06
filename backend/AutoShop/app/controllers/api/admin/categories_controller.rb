module Api
  module Admin
    class CategoriesController < BaseController
      def create
        category = Category.new(category_params)

        if category.save
          render json: CategorySerializer.as_json(category), status: :created
        else
          render_validation_error(category)
        end
      end

      def show
        category = Category.find(params[:id])
        render json: CategorySerializer.as_json(category)
      end

      def update
        category = Category.find(params[:id])

        if category.update(category_params)
          render json: CategorySerializer.as_json(category)
        else
          render_validation_error(category)
        end
      end

      def destroy
        category = Category.find(params[:id])

        if category.destroy
          head :ok
        else
          render_validation_error(category)
        end
      end

      private

      def category_params
        params.permit(:name, :description)
      end

      def render_validation_error(record)
        render_error(
          error:   "validation_error",
          message: record.errors.full_messages.first || "Неверные данные",
          status:  :bad_request
        )
      end
    end
  end
end
