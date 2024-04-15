# Backend de la Aplicación con Ruby on Rails
Este directorio contiene el backend de la aplicación, implementado con Ruby on Rails. Aquí se detallan los pasos necesarios para configurar y ejecutar el servidor localmente.

## Configuración inicial

Antes de iniciar el servidor, es necesario configurar la base de datos y poblarla con datos iniciales. Sigue los siguientes pasos:

### Prerrequisitos

- Ruby [versión]
- Rails [versión]
- PostgreSQL [versión] o adaptar a otro sistema de gestión de base de datos si es necesario

### Instrucciones

1. **Creación de la base de datos:**
   ```bash 
    1_ rails db:create
    2_ rails db:migrate
    3_ rails usgs:fetch_data
    4_ rails s

