module Api
  module Admin
    class UsersController < BaseController
      def index
        scope = Account.order(:id)
        page_scope = paginated_scope(scope)

        # Поля total_orders/orders — как в OpenAPI (опечатка в спецификации для users).
        render json: admin_list_payload(
          total_key:      :total_orders,
          collection_key: :orders,
          scope:          scope,
          items:          AccountSerializer.collection_as_json(page_scope)
        )
      end

      def destroy
        deleted_count = Account.count
        Account.destroy_all

        render json: { deleted_count: deleted_count }
      end
    end
  end
end
