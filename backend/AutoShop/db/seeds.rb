# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

categories = [
  { slug: "akkumulyatori", name: "Аккумуляторы", position: 1, image: "/images/categories/akkumulyator.png" },
  { slug: "avtomasla",     name: "Автомасла",    position: 2, image: "/images/categories/avtomaslo.png" },
  { slug: "avtohimia",     name: "Автохимия",    position: 3, image: "/images/categories/avtohimia.png" },
  { slug: "aksessuari",    name: "Аксессуары",   position: 4, image: "/images/categories/aksessuari.png" }
]

categories.each do |attrs|
  Category.find_or_create_by!(slug: attrs[:slug]) do |category|
    category.name     = attrs[:name]
    category.position = attrs[:position]
    category.image    = attrs[:image]
  end
end

if Rails.env.development?
  Account.find_or_create_by!(email: "admin@autoshop.local") do |account|
    account.password = ENV.fetch("ADMIN_SEED_PASSWORD", "admin123")
    account.role     = :admin
  end
end
