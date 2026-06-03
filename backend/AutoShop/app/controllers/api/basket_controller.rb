module Api
  class BasketController < BaseController
    before_action :authenticate_account!

    def show
      items = current_basket.basket_items.includes(:product).order(:id)
      render json: { items: BasketItemSerializer.collection_as_json(items) }
    end

    def create
      product_id = params[:product_id]
      quantity   = params[:quantity].to_i

      if product_id.blank? || quantity < 1
        return render_error(
          error:   "bad_request",
          message: "product_id и quantity обязательны (quantity ≥ 1)",
          status:  :bad_request
        )
      end

      product = Product.find_by(id: product_id)
      return render_not_found unless product

      item = current_basket.basket_items.find_or_initialize_by(product: product)
      item.quantity = item.persisted? ? item.quantity + quantity : quantity

      if item.save
        head :ok
      else
        render_error(
          error:   "validation_error",
          message: item.errors.full_messages.first || "Не удалось добавить товар",
          status:  :bad_request
        )
      end
    end

    def destroy
      item = current_basket.basket_items.find_by(product_id: params[:id])
      return render_not_found unless item

      item.destroy
      head :ok
    end

    private

    def current_basket
      @current_basket ||= current_account.basket || current_account.create_basket!
    end
  end
end
