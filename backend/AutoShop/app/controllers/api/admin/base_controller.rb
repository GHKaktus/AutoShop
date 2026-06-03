module Api
  module Admin
    class BaseController < Api::BaseController
      include Paginatable

      before_action :authenticate_account!
      before_action :require_admin!

      private

      def admin_list_payload(total_key:, collection_key:, scope:, items:)
        {
          total_key => scope.count,
          current_page: requested_page,
          page_size: PAGE_SIZE,
          collection_key => items
        }
      end
    end
  end
end
