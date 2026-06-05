class OrderSerializer
  def self.as_json(order)
    {
      id:           order.id,
      user_id:      order.account_id,
      name:         order.name,
      phone:        order.phone,
      email:        order.email,
      comment:      order.comment,
      status:       order.status,
      total_amount: order.total_amount,
      items:        order.order_items.map { |item| order_item_as_json(item) },
      created_at:   order.created_at.iso8601,
      updated_at:   order.updated_at.iso8601,
      address:      order.address
    }
  end

  def self.collection_as_json(orders)
    orders.map { |order| as_json(order) }
  end

  def self.order_item_as_json(item)
    {
      product_id: item.product_id,
      quantity:   item.quantity,
      name:       item.name
    }
  end

  private_class_method :order_item_as_json
end
