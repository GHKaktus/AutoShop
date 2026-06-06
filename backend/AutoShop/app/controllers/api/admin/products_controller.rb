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
          render_validation_error(product)
        end
      end

      def show
        product = Product.find(params[:id])
        render json: ProductSerializer.as_json(product)
      end

      def update
        product = Product.find(params[:id])

        if product.update(product_params)
          render json: ProductSerializer.as_json(product)
        else
          render_validation_error(product)
        end
      end

      def destroy
        product = Product.find(params[:id])
        product.destroy

        head :ok
      end

      private

      def render_validation_error(record)
        render_error(
          error:   "validation_error",
          message: record.errors.full_messages.first || "Неверные данные",
          status:  :bad_request
        )
      end

      def product_params
        params.permit(:name, :cost, :sale_cost, :picture, :description, :stock, :category_id)
      end
    end
  end
end
