# Earthquake Tracker

A Ruby on Rails API paired with a React frontend for browsing real-time earthquake data, viewing event details, and leaving comments on individual earthquakes.

## Structure

- `/seismic_app`: Ruby on Rails API (`Earthquake` and `Comment` models, versioned API controllers).
- `/frogmi-app`: React frontend (list view, detail view, comment form) using the Context API for state.

## Run locally

```bash
# API
cd seismic_app
bundle install
rails db:setup
rails server

# Frontend
cd frogmi-app
npm install
npm start
```

## Mejoras Sugeridas

### Backend

1. **Autenticación**: Implementar un sistema de autenticación para proteger las rutas críticas del API.
2. **Test de las APIs**: Implementar un sistema de teste que corrobore el buen funcionamiento de las APIs.

### Frontend

1. **Mejoras en UI/UX**: Rediseñar componentes para mejorar la experiencia de usuario.

### Infraestructura

1. **Dockerización**: Crear `Dockerfile` y `docker-compose.yml` para facilitar el despliegue y la configuración del entorno de desarrollo.
2. **CI/CD**: Implementar pipelines de integración y despliegue continuo para automatizar la prueba y lanzamiento de nuevas versiones del software.

