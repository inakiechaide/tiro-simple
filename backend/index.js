import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuración de rutas para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = join(__dirname, '.env');
console.log('Cargando variables de entorno desde:', envPath);
dotenv.config({ path: envPath });

// Verificar variables de entorno
console.log('Variables de entorno cargadas:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '***' : 'No definida');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'No definida');
console.log('- PORT:', process.env.PORT || 3000);

const app = express();
const { Pool } = pg;

// Conexión a la base de datos
console.log('Intentando conectar a la base de datos con URL:', 
  process.env.DATABASE_URL ? 
  process.env.DATABASE_URL.replace(/:([^:]*?)@/, ':***@') : 
  'No hay DATABASE_URL configurada');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de base de datos:', err);
  process.exit(-1);
});

// Probar la conexión a la base de datos
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a la base de datos exitosa');
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    console.error('Código de error:', error.code);
    process.exit(1);
  }
}

testConnection();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware de autenticación
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Token vacío' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// ============ RUTAS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login de socio
app.post('/api/login', async (req, res) => {
  try {
    const { dni, password } = req.body;
    
    // Validaciones
    if (!dni || !password) {
      return res.status(400).json({ error: 'DNI y contraseña son requeridos' });
    }

    const dniLimpio = dni.toString().replace(/\D/g, '');
    
    if (dniLimpio.length < 7) {
      return res.status(400).json({ error: 'DNI inválido' });
    }
    
    const result = await pool.query(
      'SELECT * FROM socios WHERE dni = $1',
      [dniLimpio]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'DNI o contraseña incorrectos' });
    }
    
    const socio = result.rows[0];
    
    // Verificar que el hash existe
    if (!socio.password_hash) {
      console.error('Socio sin password_hash:', socio.id);
      return res.status(500).json({ error: 'Error en la configuración de la cuenta' });
    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(password, socio.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'DNI o contraseña incorrectos' });
    }
    
    const token = jwt.sign(
      { id: socio.id, dni: socio.dni, tipo: 'socio' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      socio: {
        id: socio.id,
        dni: socio.dni,
        nombre: socio.nombre,
        apellido: socio.apellido,
        numeroSocio: socio.numero_socio,
        fechaVencimiento: socio.fecha_vencimiento,
        categoria: socio.categoria,
        foto: socio.foto_url
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login de admin
app.post('/api/login-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validaciones
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }
    
    const result = await pool.query(
      'SELECT * FROM administradores WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    const admin = result.rows[0];

    // Verificar que el hash existe
    if (!admin.password_hash) {
      console.error('Admin sin password_hash:', admin.id);
      return res.status(500).json({ error: 'Error en la configuración de la cuenta' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, tipo: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, admin: { username: admin.username } });
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener carnet del socio autenticado
app.get('/api/carnet', auth, async (req, res) => {
  try {
    if (req.user.tipo !== 'socio') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const result = await pool.query(
      'SELECT * FROM socios WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    const socio = result.rows[0];
    const isVigente = new Date(socio.fecha_vencimiento) >= new Date();
    
    res.json({
      dni: socio.dni,
      nombre: socio.nombre,
      apellido: socio.apellido,
      numeroSocio: socio.numero_socio,
      fechaVencimiento: socio.fecha_vencimiento,
      categoria: socio.categoria,
      foto: socio.foto_url,
      isVigente
    });
  } catch (error) {
    console.error('Error al obtener carnet:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Verificar carnet por número de socio
app.post('/api/verificar', auth, async (req, res) => {
  try {
    const { numeroSocio } = req.body;
    
    if (!numeroSocio) {
      return res.status(400).json({ error: 'Número de socio requerido' });
    }
    
    const result = await pool.query(
      'SELECT * FROM socios WHERE numero_socio = $1',
      [numeroSocio]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        valido: false,
        mensaje: 'Número de socio no encontrado'
      });
    }
    
    const socio = result.rows[0];
    const isVigente = new Date(socio.fecha_vencimiento) >= new Date();
    
    res.json({
      valido: isVigente,
      mensaje: isVigente ? 'Carnet vigente' : 'Carnet vencido',
      socio: {
        nombre: socio.nombre,
        apellido: socio.apellido,
        numeroSocio: socio.numero_socio,
        categoria: socio.categoria,
        fechaVencimiento: socio.fecha_vencimiento
      }
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ============ RUTAS DE ADMIN ============

// Middleware para verificar que es admin
const esAdmin = (req, res, next) => {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
  }
  next();
};

// Listar todos los socios (con filtro opcional)
app.get('/api/admin/socios', auth, esAdmin, async (req, res) => {
  try {
    const { search } = req.query; // <-- parámetro de búsqueda

    let query = `
      SELECT id, dni, nombre, apellido, numero_socio, fecha_vencimiento, categoria, foto_url 
      FROM socios
    `;
    
    let params = [];

    if (search && search.trim() !== "") {
      query += `
        WHERE 
          dni ILIKE $1 OR
          nombre ILIKE $1 OR
          apellido ILIKE $1 OR
          numero_socio::text ILIKE $1 OR
          categoria ILIKE $1
      `;
      params.push(`%${search}%`);
    }

    query += " ORDER BY apellido, nombre";

    const result = await pool.query(query, params);
    
    const socios = result.rows.map(s => ({
      ...s,
      isVigente: new Date(s.fecha_vencimiento) >= new Date()
    }));
    
    res.json(socios);
  } catch (error) {
    console.error('Error al listar socios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// Crear nuevo socio
app.post('/api/admin/socios', auth, esAdmin, async (req, res) => {
  try {
    const { dni, nombre, apellido, numeroSocio, password, fechaVencimiento, categoria } = req.body;
    
    // Validaciones estrictas
    if (!dni || !nombre || !apellido || !numeroSocio || !password || !fechaVencimiento) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos: DNI, nombre, apellido, número de socio, contraseña y fecha de vencimiento' 
      });
    }

    const dniLimpio = dni.toString().replace(/\D/g, '');

    // Validar DNI
    if (dniLimpio.length < 7) {
      return res.status(400).json({ error: 'El DNI debe tener al menos 7 dígitos' });
    }

    // Validar contraseña
    if (password.length < 4) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
    }
    
    // Verificar que no exista el DNI
    const existe = await pool.query('SELECT id FROM socios WHERE dni = $1', [dniLimpio]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un socio con ese DNI' });
    }

    // Verificar que no exista el número de socio
    const existeNumero = await pool.query('SELECT id FROM socios WHERE numero_socio = $1', [numeroSocio]);
    if (existeNumero.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un socio con ese número' });
    }
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    const fotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}+${encodeURIComponent(apellido)}&size=200&background=2c5282&color=fff`;
    
    const result = await pool.query(
      `INSERT INTO socios (dni, nombre, apellido, numero_socio, password_hash, fecha_vencimiento, categoria, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, dni, nombre, apellido, numero_socio, fecha_vencimiento, categoria`,
      [dniLimpio, nombre, apellido, numeroSocio, passwordHash, fechaVencimiento, categoria || 'Titular', fotoUrl]
    );
    
    console.log('Socio creado exitosamente:', result.rows[0].id);
    res.json({ mensaje: 'Socio creado exitosamente', socio: result.rows[0] });
  } catch (error) {
    console.error('Error al crear socio:', error);
    res.status(500).json({ error: 'Error en el servidor al crear socio' });
  }
});

// Actualizar socio
app.put('/api/admin/socios/:id', auth, esAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, fechaVencimiento, categoria, password } = req.body;
    
    // Validaciones
    if (!nombre || !apellido || !fechaVencimiento) {
      return res.status(400).json({ error: 'Nombre, apellido y fecha de vencimiento son requeridos' });
    }

    // Verificar que el socio existe
    const existeSocio = await pool.query('SELECT id FROM socios WHERE id = $1', [id]);
    if (existeSocio.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    
    let query, params;

    // Si se proporciona una nueva contraseña
    if (password && password.trim() !== '') {
      // Validar longitud mínima
      if (password.length < 4) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      query = 'UPDATE socios SET nombre = $1, apellido = $2, fecha_vencimiento = $3, categoria = $4, password_hash = $5 WHERE id = $6 RETURNING id, dni, nombre, apellido, numero_socio, fecha_vencimiento, categoria';
      params = [nombre, apellido, fechaVencimiento, categoria || 'Titular', passwordHash, id];
      console.log('Actualizando socio CON nueva contraseña:', id);
    } else {
      // Sin cambio de contraseña
      query = 'UPDATE socios SET nombre = $1, apellido = $2, fecha_vencimiento = $3, categoria = $4 WHERE id = $5 RETURNING id, dni, nombre, apellido, numero_socio, fecha_vencimiento, categoria';
      params = [nombre, apellido, fechaVencimiento, categoria || 'Titular', id];
      console.log('Actualizando socio SIN cambiar contraseña:', id);
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json({ mensaje: 'Socio actualizado exitosamente', socio: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar socio:', error);
    res.status(500).json({ error: 'Error en el servidor al actualizar socio' });
  }
});

// Eliminar socio
app.delete('/api/admin/socios/:id', auth, esAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el socio existe antes de eliminar
    const existeSocio = await pool.query('SELECT id FROM socios WHERE id = $1', [id]);
    if (existeSocio.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    await pool.query('DELETE FROM socios WHERE id = $1', [id]);
    console.log('Socio eliminado:', id);
    res.json({ mensaje: 'Socio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar socio:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar socio' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🏛️  Backend Carnet Virtual       ║
║  ✅ Servidor corriendo en ${PORT}     ║
║  📍 http://localhost:${PORT}         ║
╚════════════════════════════════════╝
  `);
});