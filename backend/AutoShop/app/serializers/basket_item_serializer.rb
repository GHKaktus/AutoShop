class BasketItemSerializer
  def self.as_json(item)
    {
      product:  ProductSerializer.as_json(item.product),
      quantity: item.quantity
    }
  end

  def self.collection_as_json(items)
    items.map { |item| as_json(item) }
  end
end
