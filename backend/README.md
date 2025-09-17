# PIN-App Backend - Supabase Docker Setup

Este documento proporciona una guía completa para instalar y desplegar el backend del proyecto PIN-App utilizando Docker y Supabase.

## 📋 Tabla de Contenido

-   [Requisitos Previos](#requisitos-previos)
-   [Estructura del Proyecto](#estructura-del-proyecto)
-   [Configuración Inicial](#configuración-inicial)
-   [Instalación](#instalación)
-   [Despliegue](#despliegue)
-   [Comandos Útiles](#comandos-útiles)
-   [Configuración de Entorno](#configuración-de-entorno)
-   [Servicios Incluidos](#servicios-incluidos)
-   [Resolución de Problemas](#resolución-de-problemas)
-   [Base de Datos](#base-de-datos)

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

-   **Docker** (versión 20.10 o superior)
-   **Docker Compose** (versión 2.0 o superior)
-   **Git** (para clonar el repositorio)

### Verificar instalación de Docker

```bash
docker --version
docker compose version
```

## 📁 Estructura del Proyecto

```
backend/
├── docker-compose.yml          # Configuración principal de Docker
├── docker-compose.s3.yml       # Configuración adicional para S3
├── .env.example                # Plantilla de variables de entorno
├── .env                        # Variables de entorno (se crea automáticamente)
├── reset.sh                    # Script para resetear el entorno
├── dev/
│   ├── docker-compose.dev.yml  # Configuración para desarrollo
│   └── data.sql                # Datos semilla para desarrollo
└── volumes/
    ├── api/kong.yml            # Configuración del API Gateway
    ├── db/                     # Scripts de inicialización de PostgreSQL
    ├── functions/              # Edge Functions de Supabase
    ├── logs/                   # Configuración de logs
    ├── pooler/                 # Configuración del pooler de conexiones
    └── storage/                # Almacenamiento de archivos
```

## 🚀 Instalación

```bash
# Iniciar todos los servicios
docker compose up
```

### Verificar que los servicios estén funcionando

```bash
# Ver el estado de todos los contenedores
docker compose ps

# Ver logs de todos los servicios
docker compose logs

# Ver logs de un servicio específico
docker compose logs supabase-db
```

## 🌐 Despliegue

Una vez que todos los servicios estén ejecutándose, podrás acceder a:

| Servicio        | URL                   | Descripción                  |
| --------------- | --------------------- | ---------------------------- |
| **API Gateway** | http://localhost:8000 | Endpoint principal de la API |

### Credenciales de acceso

-   **Supabase Studio**:

    -   Usuario: valor de `DASHBOARD_USERNAME` en `.env`
    -   Contraseña: valor de `DASHBOARD_PASSWORD` en `.env`

-   **Base de datos**:
    -   Host: `localhost`
    -   Puerto: `5432`
    -   Usuario: `postgres`
    -   Contraseña: valor de `POSTGRES_PASSWORD` en `.env`
    -   Base de datos: `postgres`

## 🛠️ Comandos Útiles

### Gestión de contenedores

```bash
# Iniciar servicios
docker compose up -d

# Detener servicios
docker compose down

# Reiniciar un servicio específico
docker compose restart supabase-db

# Ver logs en tiempo real
docker compose logs -f

# Ejecutar comandos en un contenedor
docker compose exec supabase-db psql -U postgres -d postgres
```

### Gestión de datos

```bash
# Hacer backup de la base de datos
docker compose exec supabase-db pg_dump -U postgres postgres > backup.sql

# Restaurar backup
docker compose exec -T supabase-db psql -U postgres -d postgres < backup.sql

# Acceder a la base de datos
docker compose exec supabase-db psql -U postgres -d postgres
```

### Reset completo del entorno

```bash
# En sistemas Unix/Linux/MacOS
./reset.sh

# En Windows (PowerShell)
docker compose -f docker-compose.yml -f ./dev/docker-compose.dev.yml down -v --remove-orphans
Remove-Item -Recurse -Force ./volumes/db/data -ErrorAction SilentlyContinue
Remove-Item .env -ErrorAction SilentlyContinue
Copy-Item .env.example .env
```

## 🔧 Configuración de Entorno

### Variables de entorno importantes

| Variable            | Descripción                   | Valor por defecto       |
| ------------------- | ----------------------------- | ----------------------- |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL      | -                       |
| `JWT_SECRET`        | Clave secreta para JWT        | -                       |
| `SITE_URL`          | URL de tu aplicación frontend | `http://localhost:3000` |
| `API_EXTERNAL_URL`  | URL externa de la API         | `http://localhost:8000` |
| `KONG_HTTP_PORT`    | Puerto HTTP del API Gateway   | `8000`                  |
| `KONG_HTTPS_PORT`   | Puerto HTTPS del API Gateway  | `8443`                  |
| `POSTGRES_PORT`     | Puerto de PostgreSQL          | `5432`                  |

### Configuración para producción

Para un entorno de producción, asegúrate de:

1. **Cambiar todas las contraseñas** y claves secretas
2. **Configurar HTTPS** apropiadamente
3. **Configurar backup automático** de la base de datos
4. **Monitorear logs** y métricas
5. **Configurar firewall** y seguridad de red

## 🚀 Servicios Incluidos

El stack de Supabase incluye los siguientes servicios:

### Core Services

-   **PostgreSQL** - Base de datos principal
-   **PostgREST** - API REST automática
-   **GoTrue** - Servicio de autenticación
-   **Realtime** - Suscripciones en tiempo real
-   **Storage** - Gestión de archivos
-   **Edge Functions** - Funciones serverless

### Supporting Services

-   **Kong** - API Gateway y proxy reverso
-   **Supabase Studio** - Dashboard web
-   **Supavisor** - Pooler de conexiones de base de datos
-   **Vector** - Recolector de logs
-   **Logflare** - Analytics y logs
-   **ImgProxy** - Procesamiento de imágenes

### Development Services (solo en modo dev)

-   **Inbucket** - Servidor de correo para desarrollo
-   **Mail Service** - Servicio de correo de pruebas

## 🗄️ Base de Datos

### Esquema inicial

El proyecto incluye un esquema base con:

-   Tabla `profiles` - Perfiles de usuario
-   Políticas RLS (Row Level Security) configuradas
-   Publicación Realtime habilitada
-   Bucket de Storage para avatares

### Conectarse a la base de datos

```bash
# Desde el host
psql -h localhost -p 5432 -U postgres -d postgres

# Desde Docker
docker compose exec supabase-db psql -U postgres -d postgres
```

### Migraciones

Las migraciones se ejecutan automáticamente al iniciar los contenedores. Los scripts están ubicados en:

-   `volumes/db/*.sql` - Scripts de inicialización
-   `dev/data.sql` - Datos semilla para desarrollo

## 🐛 Resolución de Problemas

### Errores comunes

1. **Puerto ya en uso**

    ```bash
    # Cambiar puertos en .env
    KONG_HTTP_PORT=8001
    POSTGRES_PORT=5433
    ```

2. **Falta de memoria**

    ```bash
    # Verificar uso de memoria
    docker stats

    # Liberar recursos
    docker system prune -f
    ```

3. **Permisos de archivos**

    ```bash
    # En sistemas Unix
    sudo chown -R $USER:$USER ./volumes
    chmod -R 755 ./volumes
    ```

4. **Contenedores que no inician**

    ```bash
    # Ver logs detallados
    docker compose logs [nombre-servicio]

    # Reiniciar servicios
    docker compose restart
    ```

### Logs útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Logs específicos por servicio
docker compose logs -f supabase-db      # Base de datos
docker compose logs -f supabase-studio  # Dashboard
docker compose logs -f supabase-kong    # API Gateway
docker compose logs -f supabase-auth    # Autenticación
```

### Verificar salud de servicios

```bash
# Verificar que todos los servicios estén saludables
docker compose ps

# Verificar conectividad
curl http://localhost:8000/health
curl http://localhost:3000/api/platform/profile
```

## 📝 Notas adicionales

-   Los datos de la base de datos se persisten en `./volumes/db/data/`
-   Los archivos subidos se almacenan en `./volumes/storage/`
-   Las funciones Edge están en `./volumes/functions/`
-   Para desarrollo, se recomienda usar el archivo `dev/docker-compose.dev.yml`
-   En producción, considera usar servicios externos para PostgreSQL y Storage

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia [especificar licencia].

---

Para más información sobre Supabase, visita: https://supabase.com/docs
