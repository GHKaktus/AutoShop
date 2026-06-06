class CategorySerializer
  def self.as_json(category)
    {
      id:          category.id,
      name:        category.name,
      description: category.description
    }
  end

  def self.collection_as_json(categories)
    categories.map { |category| as_json(category) }
  end
end
