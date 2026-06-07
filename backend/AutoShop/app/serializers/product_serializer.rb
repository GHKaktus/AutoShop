class ProductSerializer
  def self.as_json(product)
    {
      id: product.id,
      name: product.name,
      cost: product.cost.to_f,
      sale_cost: product.sale_cost.to_f,
      picture: product.picture,
      description: product.description,
      stock: product.stock
    }
  end

  def self.collection_as_json(products)
    products.map { |product| as_json(product) }
  end
end
