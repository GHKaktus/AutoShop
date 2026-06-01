class Category < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  before_validation :generate_slug, if: -> { slug.blank? && name.present? }

  validates :name,     presence: true, length: { maximum: 100 }
  validates :slug,     presence: true, uniqueness: true, length: { maximum: 100 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(:position, :id) }

  private

  def generate_slug
    self.slug = name.to_s.parameterize
  end
end
