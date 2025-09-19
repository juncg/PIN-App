# Backend - Supabase local

Este directorio contiene la configuración para ejecutar el backend (Supabase + Postgres) en local usando Docker Compose.
Contenido relevante

Requisitos

-   Docker Desktop (o Docker Engine) y Docker Compose.
-   PowerShell (en Windows) o bash (Linux/macOS) para ejecutar comandos.

Preparación

1. Copiar variables de entorno: crea un archivo `.env` a partir de `.env.example` si aún no existe. El archivo .env del backend y frontend está subido en la carpeta compartida del drive

2. Arrancar la stack

Desde el directorio `backend` ejecuta:

```powershell
docker compose up -d
```

Esto levantará los contenedores de Postgres/Supabase y las funciones.

3. Accede a localhost:8000, desde ahí manejas toda la base de datos con interfaz.

Si te pide usuario y contraseña, son los que están dentro del .env (DASHBOARD_USERNAME y DASHBOARD_PASSWORD)
