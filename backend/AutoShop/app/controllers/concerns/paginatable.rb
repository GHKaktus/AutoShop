module Paginatable
  extend ActiveSupport::Concern

  PAGE_SIZE = 20

  private

  def requested_page
    page = params.fetch(:page, 0).to_i
    raise ActionController::ParameterMissing, "page must be greater or equal to 0" if page.negative?

    page
  end

  def pagination_payload(scope, items:)
    {
      total_items: scope.count,
      current_page: requested_page,
      page_size: PAGE_SIZE,
      items: items
    }
  end

  def paginated_scope(scope)
    scope.page(requested_page + 1).per(PAGE_SIZE)
  end
end
