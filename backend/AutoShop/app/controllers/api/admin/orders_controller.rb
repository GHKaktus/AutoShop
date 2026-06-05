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

      def destroy
        deleted_count = Order.count
        Order.destroy_all

        render json: { deleted_count: deleted_count }
      end
    end
  end
end
