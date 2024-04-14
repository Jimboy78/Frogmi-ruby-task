Rails.application.routes.draw do
  # Namespace for API to segregate from any future web routes cleanly
  namespace :api do
    namespace :v1 do  # Versioning the API
      resources :features, only: [:index], path: 'earthquakes' do
        resources :comments, only: [:create]
      end
    end
  end
end
