module Api
  module Basket
    class OrdersController < Api::BaseController
      before_action :authenticate_account!

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
          items.each { |item| item.product.decrement_stock!(item.quantity) }
          order.save!
          basket.clear!
        end

        render json: {
          order_id:     order.id,
          total_amount: order.total_amount.to_f,
          message:      SUCCESS_MESSAGE
        }, status: :created
      rescue Product::StockInsufficient => e
        render_error(error: "validation_error", message: e.message, status: :bad_request)
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

        basket_items.each do |basket_item|
          order.order_items.build(
            product:  basket_item.product,
            name:     basket_item.product.name,
            cost:     basket_item.product.effective_cost,
            quantity: basket_item.quantity
          )
        end

        order.total_amount = order.order_items.sum { |i| i.cost * i.quantity }
        order
      end

      def order_form_params
        params.permit(:name, :phone, :email, :comment)
      end
    end
  end
end
