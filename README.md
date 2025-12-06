# Tiro Simple

Aplicación web para la gestión de socios de un club de tiro, con autenticación y panel de administración.

## Características

- Autenticación de usuarios
- Gestión de socios
- Escaneo de códigos QR
- Panel de administración
- API RESTful
- Interfaz responsiva

## Estructura del Proyecto

```
tiro-simple/
├── backend/                     # Backend (Node.js + Express)
│   ├── .env.example            # Plantilla de variables de entorno
│   └── index.js                # Punto de entrada del servidor
│
├── frontend/                    # Frontend (React + Vite)
│   ├── public/                 # Archivos estáticos
│   ├── src/
│   │   ├── assets/            # Recursos estáticos (imágenes, fuentes, etc.)
│   │   ├── components/        # Componentes reutilizables
│   │   ├── controllers/       # Controladores para la lógica de negocio
│   │   ├── hooks/            # Custom hooks
│   │   ├── models/           # Modelos de datos
│   │   ├── services/         # Servicios para comunicación con la API
│   │   ├── utils/            # Utilidades y constantes
│   │   ├── views/            # Vistas principales de la aplicación
│   │   ├── App.jsx           # Componente raíz de la aplicación
│   │   └── main.jsx          # Punto de entrada de la aplicación
│   │
│   ├── .env                  # Variables de entorno del frontend
│   ├── index.html            # Plantilla HTML principal
│   ├── package.json          # Dependencias y scripts del frontend
│   ├── tailwind.config.js    # Configuración de Tailwind CSS
│   └── vite.config.js        # Configuración de Vite
│
├── .gitignore                # Archivos a ignorar por Git
├── package.json             # Dependencias y scripts globales
└── README.md                # Documentación del proyecto
```


## 🚀 Configuración

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- PostgreSQL (v12 o superior)

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tiro-simple.git
   cd tiro-simple
   ```

2. Instalar dependencias:
   ```bash
   npm run install:all
   ```

### Configuración del Backend

1. Copiar el archivo de ejemplo de variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Configurar las variables en `backend/.env` con tus credenciales:
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_bd
   JWT_SECRET=tu_clave_secreta_muy_segura
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

### Configuración del Frontend

1. Asegúrate de que la variable `VITE_API_URL` en `frontend/.env` apunte a tu backend:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

## 🚦 Uso

### Desarrollo

1. Iniciar el servidor de desarrollo del backend:
   ```bash
   npm run dev
   ```

2. En otra terminal, iniciar el frontend:
   ```bash
   npm run frontend
   ```

### Producción

1. Construir el frontend para producción:
   ```bash
   npm run build
   ```

2. El frontend estará disponible en la carpeta `frontend/dist`

3. Para producción, se recomienda usar PM2 o similar para mantener el servidor Node.js en ejecución:
   ```bash
   npm install -g pm2
   pm2 start npm --name "tiro-simple" -- start
   ```

## 📝 Variables de Entorno

### Backend (`.env`)
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `PORT`: Puerto del servidor (por defecto: 3000)
- `FRONTEND_URL`: URL del frontend para CORS

### Frontend (`.env`)
- `VITE_API_URL`: URL de la API del backend

## 🤝 Contribuir

1. Haz un Fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✨ Créditos

- Desarrollado por [Tu Nombre](https://github.com/tu-usuario)
