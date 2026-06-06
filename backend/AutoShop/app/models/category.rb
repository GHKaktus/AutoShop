class Category < ApplicationRecord
  TRANSLIT = {
    "а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d", "е" => "e",
    "ё" => "e", "ж" => "zh", "з" => "z", "и" => "i", "й" => "y", "к" => "k",
    "л" => "l", "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
    "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h", "ц" => "ts",
    "ч" => "ch", "ш" => "sh", "щ" => "sch", "ъ" => "", "ы" => "y", "ь" => "",
    "э" => "e", "ю" => "yu", "я" => "ya"
  }.freeze

  has_many :products, dependent: :restrict_with_error

  before_validation :generate_slug, if: -> { slug.blank? && name.present? }

  validates :name,        presence: true, length: { maximum: 100 }
  validates :slug,        presence: true, uniqueness: true, length: { maximum: 100 }
  validates :description, length: { maximum: 1_000 }, allow_blank: true
  validates :position,    numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(:position, :id) }

  private

  def generate_slug
    base = name.to_s.downcase.chars.map { |char| TRANSLIT.fetch(char, char) }.join.parameterize
    base = "category" if base.blank?

    candidate = base
    counter   = 2
    while Category.where.not(id: id).exists?(slug: candidate)
      candidate = "#{base}-#{counter}"
      counter += 1
    end

    self.slug = candidate
  end
end
