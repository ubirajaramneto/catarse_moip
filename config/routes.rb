CatarseMoip::Engine.routes.draw do
  namespace :payment do
    resources :moip, only: [] do
      collection do
        post 'notifications' => "moip#create_notification"
        get 'js'
      end
      member do
        match :moip_response
        match :review
        match :get_moip_token
      end
    end
  end
end
