module Api
  class ProductsController < BaseController
    def show
      product = Product.find(params[:id])
      render json: ProductSerializer.as_json(product)
    end
  end
end
