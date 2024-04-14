Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :earthquakes, only: [:index, :show] do  # Agregado :show aquí
        resources :comments, only: [:create]
      end
    end
  end
end