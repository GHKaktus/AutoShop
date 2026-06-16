class ProductSerializer
  def self.as_json(product)
    {
      id: product.id,
      name: product.name,
      cost: product.cost.to_f,
      sale_cost: product.sale_cost.to_f,
      picture: picture_for(product),
      description: product.description,
      stock: product.stock
    }
  end

  def self.collection_as_json(products)
    products.map { |product| as_json(product) }
  end

  def self.picture_for(product)
    return product.picture unless product.image.attached?

    blob = product.image.blob
    "/rails/active_storage/blobs/redirect/#{blob.signed_id}/#{blob.filename}"
  end
  private_class_method :picture_for
end
