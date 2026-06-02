class SpaController < ApplicationController
  skip_forgery_protection

  def index
    index_path = spa_index_path
    return head :not_found unless index_path

    send_file index_path, type: "text/html", disposition: "inline"
  end

  private

  def spa_index_path
    candidates = [
      Rails.root.join("..", "..", "frontend", "dist", "index.html"),
      Rails.root.join("..", "..", "frontend", "index.html")
    ]

    candidates.map(&:to_s).find { |path| File.exist?(path) }
  end
end
