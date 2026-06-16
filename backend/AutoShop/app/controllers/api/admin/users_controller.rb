module Api
  module Admin
    class UsersController < BaseController
      def index
        scope = Account.order(:id)
        page_scope = paginated_scope(scope)

        render json: admin_list_payload(
          total_key:      :total_users,
          collection_key: :users,
          scope:          scope,
          items:          AccountSerializer.collection_as_json(page_scope)
        )
      end

      def destroy_all
        deleted_count = Account.count
        Account.destroy_all

        render json: { deleted_count: deleted_count }
      end

      def update_role
        account = Account.find(params[:user_id])

        unless Account.roles.key?(role_param)
          return render_error(
            error:   "validation_error",
            message: "Недопустимая роль пользователя",
            status:  :bad_request
          )
        end

        if account.id == current_account.id && role_param != "admin"
          return render_error(
            error:   "validation_error",
            message: "Нельзя снять с себя роль администратора",
            status:  :bad_request
          )
        end

        account.update!(role: role_param)
        render json: AccountSerializer.as_json(account)
      end

      private

      def role_param
        params[:role].to_s
      end
    end
  end
end
