module Api
  module Basket
    class OrdersController < Api::BaseController
      before_action :authenticate_account!

      DEFAULT_ADDRESS = "Не указан (самовывоз)".freeze
      SUCCESS_MESSAGE = "Заказ принят. С вами свяжутся для подтверждения.".freeze

      def create
        basket = current_account.basket || current_account.create_basket!
        items  = basket.basket_items.includes(:product).to_a

        if items.empty?
          return render_error(
            error:   "validation_error",
            message: "Корзина пуста",
            status:  :bad_request
          )
        end

        order = build_order(items)

        ActiveRecord::Base.transaction do
          order.save!
          basket.clear!
        end

        render json: {
          order_id:     order.id,
          total_amount: order.total_amount,
          message:      SUCCESS_MESSAGE
        }, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render_error(
          error:   "validation_error",
          message: e.record.errors.full_messages.first || "Неверные данные заказа",
          status:  :bad_request
        )
      end

      private

      def build_order(basket_items)
        order = current_account.orders.new(order_form_params)
        order.address = order.address.presence || DEFAULT_ADDRESS

        basket_items.each do |basket_item|
          order.order_items.build(
            product:  basket_item.product,
            name:     basket_item.product.name,
            cost:     basket_item.product.effective_cost,
            quantity: basket_item.quantity
          )
        end

        order.total_amount = order.order_items.sum { |i| i.cost.to_i * i.quantity.to_i }
        order
      end

      def order_form_params
        params.permit(:name, :phone, :email, :comment, :address)
      end
    end
  end
end
