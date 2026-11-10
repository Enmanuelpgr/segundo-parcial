const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// CONFIGURACIÓN DE SQL 
const dbConfig = {
    user: 'sa', 
    password: '1234', 
    server: 'localhost', 
    database: 'ClinicaDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Conectar a la base de datos al iniciar
sql.connect(dbConfig).then(() => {
    console.log(' Conectado exitosamente a SQL Server');
}).catch(err => {
    console.error('Error conectando a SQL Server:', err);
});

// --- RUTAS PARA MÉDICOS ---
app.get('/medicos', async (req, res) => {
    const result = await sql.query('SELECT * FROM Medicos');
    res.json(result.recordset);
});

app.post('/medicos', async (req, res) => {
    const { nombre, especialidad } = req.body;
    await sql.query`INSERT INTO Medicos (nombre, especialidad) VALUES (${nombre}, ${especialidad})`;
    res.json({ mensaje: 'Médico registrado' });
});

// --- RUTAS PARA PACIENTES ---
app.get('/pacientes', async (req, res) => {
    const result = await sql.query('SELECT * FROM Pacientes');
    res.json(result.recordset);
});

app.post('/pacientes', async (req, res) => {
    const { nombre, telefono } = req.body;
    await sql.query`INSERT INTO Pacientes (nombre, telefono) VALUES (${nombre}, ${telefono})`;
    res.json({ mensaje: 'Paciente registrado' });
});

// --- RUTAS PARA CITAS ---
app.get('/citas', async (req, res) => {
    // Usamos INNER JOIN para traer los nombres reales en lugar de solo los IDs
    const result = await sql.query(`
        SELECT Citas.id, Citas.fecha_hora, 
               Pacientes.nombre AS paciente_nombre, 
               Medicos.nombre AS medico_nombre, Medicos.especialidad
        FROM Citas
        INNER JOIN Pacientes ON Citas.paciente_id = Pacientes.id
        INNER JOIN Medicos ON Citas.medico_id = Medicos.id
    `);
    res.json(result.recordset);
});

app.post('/citas', async (req, res) => {
    const { paciente_id, medico_id, fecha_hora } = req.body;
    await sql.query`INSERT INTO Citas (paciente_id, medico_id, fecha_hora) VALUES (${paciente_id}, ${medico_id}, ${fecha_hora})`;
    res.json({ mensaje: 'Cita agendada' });
});

// --- RUTAS PARA CONSULTAS (HISTORIAL Y RECETAS) ---
app.get('/consultas', async (req, res) => {
    const result = await sql.query(`
        SELECT Consultas.id, Consultas.paciente_id, Consultas.fecha, 
               Consultas.diagnostico, Consultas.receta,
               Pacientes.nombre AS paciente_nombre, Pacientes.telefono,
               Medicos.nombre AS medico_nombre, Medicos.especialidad
        FROM Consultas
        INNER JOIN Pacientes ON Consultas.paciente_id = Pacientes.id
        INNER JOIN Medicos ON Consultas.medico_id = Medicos.id
        ORDER BY Consultas.id DESC
    `);
    res.json(result.recordset);
});

app.post('/consultas', async (req, res) => {
    const { paciente_id, medico_id, fecha, diagnostico, receta } = req.body;
    await sql.query`INSERT INTO Consultas (paciente_id, medico_id, fecha, diagnostico, receta) 
                    VALUES (${paciente_id}, ${medico_id}, ${fecha}, ${diagnostico}, ${receta})`;
    res.json({ mensaje: 'Consulta y receta guardadas' });
});

app.listen(3001, () => {
    console.log('Servidor Backend corriendo en http://localhost:3001');
});