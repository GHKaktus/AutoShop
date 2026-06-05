module Api
  module Admin
    class ProductsController < BaseController
      def index
        scope = Product.order(:id)
        page_scope = paginated_scope(scope)

        render json: admin_list_payload(
          total_key:      :total_products,
          collection_key: :products,
          scope:          scope,
          items:          ProductSerializer.collection_as_json(page_scope)
        )
      end

      def create
        product = Product.new(product_params)

        if product.save
          render json: ProductSerializer.as_json(product), status: :created
        else
          render_error(
            error:   "validation_error",
            message: product.errors.full_messages.first || "Неверные данные",
            status:  :bad_request
          )
        end
      end

      private

      def product_params
        params.permit(:name, :cost, :sale_cost, :picture, :description, :stock, :category_id)
      end
    end
  end
end
