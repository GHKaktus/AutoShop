module Api
  class CategoriesController < BaseController
    def index
      render json: CategorySerializer.collection_as_json(Category.all)
    end
  end
end
