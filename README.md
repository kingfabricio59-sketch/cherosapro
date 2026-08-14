# Cherosa

Sistema integral de gestión para una perfumería, diseñado en español con una identidad visual rosa pastel. Incluye punto de venta, catálogo, inventario, clientes, fidelidad, compras, proveedores, **Parcerias**, marketing, reportes, gastos, equipo y configuración.

## Tecnología

- Next.js 16 + React 19
- PostgreSQL
- Drizzle ORM y migraciones versionadas
- Lucide Icons
- Preparado para GitHub y Railway

## Desarrollo local

Requisitos: Node.js 22 y PostgreSQL.

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en Railway

1. Crea un repositorio en GitHub y sube este proyecto.
2. En Railway, crea un proyecto con **Deploy from GitHub repo** y selecciona el repositorio de Cherosa.
3. Añade un servicio PostgreSQL al mismo proyecto.
4. En el servicio web, crea `DATABASE_URL` como referencia a `${{Postgres.DATABASE_URL}}` y define `ADMIN_NAME` con tu nombre.
5. Genera un dominio desde **Settings → Networking → Generate Domain**.

`railway.toml` ya define la compilación, el arranque, la migración automática y el control de salud. En el primer inicio, Drizzle crea las tablas y carga los datos iniciales.

## Comandos

```bash
npm run dev          # desarrollo
npm run lint         # revisión de código
npm run build        # compilación de producción
npm run db:generate  # nueva migración tras cambiar el esquema
npm run db:migrate   # aplicar migraciones
npm start            # migrar y arrancar en producción
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Conexión PostgreSQL provista por Railway |
| `ADMIN_NAME` | No | Nombre del administrador mostrado en el sistema |
