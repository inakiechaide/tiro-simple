# Tiro Simple

Aplicación web para gestión de socios de un club de tiro.

## Estructura del Proyecto

```
tiro-simple/
├── backend/              # Backend (Node.js + Express)
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middlewares
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas de la API
│   ├── .env              # Variables de entorno
│   └── index.js          # Punto de entrada del servidor
├── frontend/             # Frontend (React + Vite)
│   ├── public/           # Archivos estáticos
│   ├── src/              # Código fuente
│   ├── .env              # Variables de entorno del frontend
│   └── ...               # Configuración de Vite y dependencias
├── .gitignore           # Archivos a ignorar por Git
└── package.json         # Dependencias y scripts del proyecto
```

## Configuración

1. Instalar dependencias:
   ```bash
   npm run install:all
   ```

2. Configurar las variables de entorno en `backend/.env`

## Uso

- Iniciar el servidor de desarrollo:
  ```bash
  npm run dev
  ```

- Iniciar el frontend en modo desarrollo:
  ```bash
  npm run frontend
  ```

- Construir para producción:
  ```bash
  npm run build
  ```

- Iniciar en producción:
  ```bash
  npm start
  ```
