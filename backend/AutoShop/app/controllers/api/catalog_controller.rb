module Api
  class CatalogController < BaseController
    include Paginatable

    def index
      category = Category.find(params[:id])

      scope = Product.where(category_id: category.id)
                     .with_availability(params[:in_stock])
                     .priced_between(params[:price_min], params[:price_max])
                     .sorted_by(params[:sort_by])

      page_scope = paginated_scope(scope)

      render json: pagination_payload(
        scope,
        items: ProductSerializer.collection_as_json(page_scope)
      )
    end
  end
end
