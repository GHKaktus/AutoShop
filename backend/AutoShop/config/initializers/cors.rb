Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGINS", "http://localhost:3001 http://localhost:5173").split

    resource "*",
             headers: :any,
             expose:  %w[Authorization],
             methods: %i[get post put patch delete options head],
             credentials: false
  end
end
