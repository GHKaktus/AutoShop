Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get "/", to: "spa#index"

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  scope module: :api, defaults: { format: :json } do
    get "catalog/:id", to: "catalog#index", as: :catalog
    get "products/:id", to: "products#show", as: :product
    get "search", to: "search#index", as: :search

    scope :auth, as: :auth do
      post "sign-up", to: "auth#sign_up", as: :sign_up
      post "sign-in", to: "auth#sign_in", as: :sign_in
      post "logout",  to: "auth#logout",  as: :logout
    end

    scope :basket, as: :basket do
      get    "",         to: "basket#show",    as: :show
      post   "",         to: "basket#create",  as: :create
      delete ":id",      to: "basket#destroy", as: :destroy
      post   "order",    to: "basket/orders#create", as: :order
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
