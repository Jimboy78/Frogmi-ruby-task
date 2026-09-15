Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Comma-separated list, e.g. "localhost:3000,https://seismic-monitor.vercel.app"
    origins(*ENV.fetch("CORS_ORIGINS", "localhost:3000").split(","))
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :delete, :patch, :options, :head],
      expose: ["Authorization"]
  end
end
