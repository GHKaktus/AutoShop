module Api
  class SearchController < BaseController
    include Paginatable

    def index
      query = params[:q].to_s.strip
      raise ActionController::ParameterMissing, "q is required" if query.blank?

      scope = Product.search(query).order(:id)
      return render_not_found if scope.none?

      page_scope = paginated_scope(scope)

      render json: pagination_payload(
        scope,
        items: ProductSerializer.collection_as_json(page_scope)
      )
    end
  end
end
