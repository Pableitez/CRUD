const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para soportar JSON (Postman, REST Client, etc.)

// Base de datos en memoria
let usuarios = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

// Página principal HTML
app.get('/', (req, res) => {
    res.send(`
        <h1>Street Fighter - Lista de usuarios</h1>
        <ul>
            ${usuarios.map(u => `<li>ID: ${u.id} | Nombre: ${u.nombre} | Edad: ${u.edad} | País: ${u.lugarProcedencia}</li>`).join('')}
        </ul>

        <h2>Agregar nuevo usuario</h2>
        <form action="/usuarios" method="post">
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" required><br>
            <label for="edad">Edad:</label>
            <input type="number" name="edad" required><br>
            <label for="lugarProcedencia">Lugar de procedencia:</label>
            <input type="text" name="lugarProcedencia" required><br>
            <button type="submit">Agregar</button>
        </form>

        <p><a href="/usuarios">Ver usuarios en formato JSON</a></p>
    `);
});

// GET /usuarios - Lista JSON
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// GET /usuarios/:nombre - Buscar por nombre
app.get('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    const usuario = usuarios.find(u => u.nombre.toLowerCase() === nombre);
    if (usuario) {
        res.json(usuario);
    } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
});

// POST /usuarios - Crear nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, edad, lugarProcedencia } = req.body;
    if (!nombre || !edad || !lugarProcedencia) {
        return res.status(400).json({ mensaje: 'Faltan datos del usuario' });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        edad: parseInt(edad),
        lugarProcedencia,
    };

    usuarios.push(nuevoUsuario);

    // Si el POST viene del formulario, redirige al inicio
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        res.redirect('/');
    } else {
        res.status(201).json(nuevoUsuario);
    }
});

// PUT /usuarios/:nombre - Actualizar usuario por nombre
app.put('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    const index = usuarios.findIndex(u => u.nombre.toLowerCase() === nombre);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const { edad, lugarProcedencia } = req.body;
    if (edad) usuarios[index].edad = parseInt(edad);
    if (lugarProcedencia) usuarios[index].lugarProcedencia = lugarProcedencia;

    res.json({ mensaje: 'Usuario actualizado', usuario: usuarios[index] });
});

// DELETE /usuarios/:nombre - Eliminar usuario por nombre
app.delete('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    const existe = usuarios.find(u => u.nombre.toLowerCase() === nombre);

    if (!existe) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuarios = usuarios.filter(u => u.nombre.toLowerCase() !== nombre);
    res.json({ mensaje: `Usuario ${nombre} eliminado` });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
