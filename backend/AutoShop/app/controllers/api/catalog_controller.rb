module Api
  class CatalogController < BaseController
    include Paginatable

    def index
      category = Category.find(params[:id])
      scope = Product.where(category_id: category.id).order(:id)
      page_scope = paginated_scope(scope)

      render json: pagination_payload(
        scope,
        items: ProductSerializer.collection_as_json(page_scope)
      )
    end
  end
end
