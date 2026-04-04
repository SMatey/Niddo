# Niddo

Niddo es una aplicación web construida con **Next.js** y **Supabase**. 
Este documento describe el proceso de instalación y configuración local principal para comenzar el desarrollo, enfocándose en asegurar una correcta conexión con Github y el entorno de Base de Datos.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu sistema:

1.  **[Node.js](https://nodejs.org/es/)** (v18 o superior).
2.  **[Git](https://git-scm.com/)** para el control de versiones.
3.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: **OPCIONAL** para correr Supabase localmente. Si no lo tienes instalado, puedes usar la base de datos en la nube. Si decides usar Docker, asegúrate de que la aplicación Docker Desktop esté **abierta y corriendo** antes de intentar levantar la base de datos (de lo contrario, verás un error `error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine...`).

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/Niddo.git
cd Niddo
```

### 2. Instalar dependencias
Instala los paquetes necesarios usando npm (o yarn/pnpm):
```bash
npm install
```

### 3. Configurar Variables de Entorno
El proyecto utiliza un archivo `.env` que, por seguridad, nunca subimos a GitHub.

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Edita tu nuevo archivo `.env` con las variables de conexión. Si vas a usar Supabase local, estas variables te las proporcionará el CLI de Supabase en el siguiente paso. Si te conectarás directamente de la nube, pega las llaves de tu proyecto de Supabase.

### 4. Iniciar Base de Datos Local (Supabase CLI)
Para habilitar el desarrollo y probar la base de datos de manera aislada usando Docker:

1. Asegúrate de que **Docker** esté en ejecución.
2. Inicia el servidor de Supabase:
   ```bash
   npx supabase start
   ```
   *(Importante: Cuando finalice de encender, te mostrará credenciales en pantalla como `API URL` y `anon key`. Asegúrate de copiar estas y colocarlas en tu archivo `.env` en los valores `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` respectivamente).*

3. (Opcional pero Recomendado) Verifica si hay nuevas migraciones y aplícalas al entorno:
   ```bash
   npx supabase db push
   ```

### 5. Iniciar Servidor de Desarrollo (Next.js)
Finalmente, levanta la app de Next.js:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Validando que el entorno está listo (US-03)

Para comprobar que terminaste de configurar el proyecto correctamente, realiza esta pequeña validación:
1. Puedes acceder al entorno de desarrollo en Next.js.
2. Al ejecutar `npx supabase status`, no debes recibir errores y todos los servicios de la base de datos local deben aparecer como "running".
3. Puedes realizar tu primer commit de prueba en tu respectiva rama validando que el archivo `.env` **no** se añade en tus cambios por error (gracias al `.gitignore`).
