module Api
  module Admin
    class OrdersController < BaseController
      def index
        scope = Order.includes(:order_items).recent
        page_scope = paginated_scope(scope)

        render json: admin_list_payload(
          total_key:      :total_orders,
          collection_key: :orders,
          scope:          scope,
          items:          OrderSerializer.collection_as_json(page_scope)
        )
      end

      def show
        order = Order.includes(:order_items).find(params[:id])
        render json: OrderSerializer.as_json(order)
      end

      def update
        order = Order.find(params[:id])

        unless Order.statuses.key?(order_params[:status].to_s)
          return render_error(
            error:   "validation_error",
            message: "Недопустимый статус заказа",
            status:  :bad_request
          )
        end

        order.update!(status: order_params[:status])
        render json: OrderSerializer.as_json(order)
      end

      def destroy
        order = Order.find(params[:id])
        order.destroy

        head :ok
      end

      def destroy_all
        deleted_count = Order.count
        Order.destroy_all

        render json: { deleted_count: deleted_count }
      end

      private

      def order_params
        params.permit(:status)
      end
    end
  end
end
