import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. ESTADO DE NAVEGACIÓN 
  const [vista, setVista] = useState('registros');

  // 2. ESTADOS PARA GUARDAR LOS DATOS QUE VIENEN DE SQL SERVER
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [consultas, setConsultas] = useState([]);

  // 3. ESTADOS DE LOS FORMULARIOS
  const [nombreMedico, setNombreMedico] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  const [nombrePaciente, setNombrePaciente] = useState('');
  const [telefono, setTelefono] = useState('');

  const [citaPacienteId, setCitaPacienteId] = useState('');
  const [citaMedicoId, setCitaMedicoId] = useState('');
  const [fechaHoraCita, setFechaHoraCita] = useState('');

  const [conPacienteId, setConPacienteId] = useState('');
  const [conMedicoId, setConMedicoId] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [receta, setReceta] = useState('');

  // Filtro de historial y estado de receta seleccionada para imprimir
  const [filtroPaciente, setFiltroPaciente] = useState('');
  const [recetaActiva, setRecetaActiva] = useState(null);

  const API_URL = 'http://localhost:3001';

  // Cargar todos los datos al abrir la página
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resMed = await fetch(`${API_URL}/medicos`);
      setMedicos(await resMed.json());

      const resPac = await fetch(`${API_URL}/pacientes`);
      setPacientes(await resPac.json());

      const resCit = await fetch(`${API_URL}/citas`);
      setCitas(await resCit.json());

      const resCon = await fetch(`${API_URL}/consultas`);
      setConsultas(await resCon.json());
    } catch (error) {
      console.error('Error cargando datos del servidor:', error);
    }
  };

  // FUNCIONES PARA GUARDAR DATOS 

  const guardarMedico = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/medicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreMedico, especialidad })
    });
    setNombreMedico('');
    setEspecialidad('');
    cargarDatos();
  };

  const guardarPaciente = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombrePaciente, telefono })
    });
    setNombrePaciente('');
    setTelefono('');
    cargarDatos();
  };

  const guardarCita = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente_id: citaPacienteId,
        medico_id: citaMedicoId,
        fecha_hora: fechaHoraCita
      })
    });
    setCitaPacienteId('');
    setCitaMedicoId('');
    setFechaHoraCita('');
    cargarDatos();
  };

  const guardarConsulta = async (e) => {
    e.preventDefault();
    const fechaHoy = new Date().toLocaleDateString();
    await fetch(`${API_URL}/consultas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente_id: conPacienteId,
        medico_id: conMedicoId,
        fecha: fechaHoy,
        diagnostico,
        receta
      })
    });
    setDiagnostico('');
    setReceta('');
    cargarDatos();
  };

  // Función para preparar e imprimir la receta
  const mandarAImprimir = (consulta) => {
    setRecetaActiva(consulta);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="contenedor-principal">
      {/* ENCABEZADO Y MENÚ  */}
      <header className="no-imprimir">
        <h1>Sistema de Gestión de Servicios Clínicos</h1>
        <div className="menu-navegacion">
          <button 
            className={vista === 'registros' ? 'activo' : ''} 
            onClick={() => setVista('registros')}>
            1. Médicos y Pacientes
          </button>
          <button 
            className={vista === 'citas' ? 'activo' : ''} 
            onClick={() => setVista('citas')}>
            2. Control de Citas
          </button>
          <button 
            className={vista === 'historial' ? 'activo' : ''} 
            onClick={() => setVista('historial')}>
            3. Historial y Recetas
          </button>
        </div>
      </header>

      {/* PANTALLA 1: REGISTROS  */}
      {vista === 'registros' && (
        <div className="grid-dos-columnas no-imprimir">
          {/* Columna de Médicos */}
          <div className="tarjeta">
            <h2>Registrar Médico</h2>
            <form onSubmit={guardarMedico}>
              <input 
                type="text" 
                placeholder="Nombre del Médico" 
                value={nombreMedico} 
                onChange={(e) => setNombreMedico(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Especialidad (ej. Pediatría)" 
                value={especialidad} 
                onChange={(e) => setEspecialidad(e.target.value)} 
                required 
              />
              <button type="submit" className="btn-guardar">Guardar Médico</button>
            </form>

            <h3>Lista de Médicos</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>Dr. {m.nombre}</td>
                    <td>{m.especialidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Columna de Pacientes */}
          <div className="tarjeta">
            <h2>Registrar Paciente</h2>
            <form onSubmit={guardarPaciente}>
              <input 
                type="text" 
                placeholder="Nombre completo del Paciente" 
                value={nombrePaciente} 
                onChange={(e) => setNombrePaciente(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Teléfono o Cédula" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
                required 
              />
              <button type="submit" className="btn-guardar">Guardar Paciente</button>
            </form>

            <h3>Lista de Pacientes</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Teléfono / Cédula</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*  PANTALLA 2: CITAS */}
      {vista === 'citas' && (
        <div className="no-imprimir">
          <div className="tarjeta">
            <h2>Agendar Nueva Cita</h2>
            <form onSubmit={guardarCita}>
              <select value={citaPacienteId} onChange={(e) => setCitaPacienteId(e.target.value)} required>
                <option value="">-- Seleccione un Paciente --</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>

              <select value={citaMedicoId} onChange={(e) => setCitaMedicoId(e.target.value)} required>
                <option value="">-- Seleccione un Médico --</option>
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>Dr. {m.nombre} ({m.especialidad})</option>
                ))}
              </select>

              <input 
                type="datetime-local" 
                value={fechaHoraCita} 
                onChange={(e) => setFechaHoraCita(e.target.value)} 
                required 
              />
              <button type="submit" className="btn-guardar">Agendar Cita</button>
            </form>
          </div>

          <div className="tarjeta">
            <h2>Citas Programadas</h2>
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico Asignado</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.paciente_nombre}</td>
                    <td>Dr. {c.medico_nombre} ({c.especialidad})</td>
                    <td>{c.fecha_hora.replace('T', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*  PANTALLA 3: HISTORIAL Y RECETAS  */}
      {vista === 'historial' && (
        <div>
          {/* Formulario para registrar consulta (No se imprime) */}
          <div className="tarjeta no-imprimir">
            <h2>Registrar Consulta Médica (Historial y Receta)</h2>
            <form onSubmit={guardarConsulta}>
              <div className="grid-dos-columnas">
                <select value={conPacienteId} onChange={(e) => setConPacienteId(e.target.value)} required>
                  <option value="">-- Seleccione el Paciente --</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>

                <select value={conMedicoId} onChange={(e) => setConMedicoId(e.target.value)} required>
                  <option value="">-- Médico que atiende --</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>Dr. {m.nombre} ({m.especialidad})</option>
                  ))}
                </select>
              </div>

              <textarea 
                rows="3" 
                placeholder="Diagnóstico / Evolución para el Historial Clínico..." 
                value={diagnostico} 
                onChange={(e) => setDiagnostico(e.target.value)} 
                required 
              />

              <textarea 
                rows="3" 
                placeholder="Receta Médica (Medicamentos, dosis y frecuencia)..." 
                value={receta} 
                onChange={(e) => setReceta(e.target.value)} 
                required 
              />

              <button type="submit" className="btn-guardar">Guardar en Historial y Generar Receta</button>
            </form>
          </div>

          {/* Tabla del Historial Clínico (No se imprime) */}
          <div className="tarjeta no-imprimir">
            <h2>Historial Clínico de Pacientes</h2>
            <select 
              value={filtroPaciente} 
              onChange={(e) => setFiltroPaciente(e.target.value)}
              style={{ marginBottom: '15px', width: '100%' }}
            >
              <option value="">Mostrar historial de todos los pacientes</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>Filtrar por: {p.nombre}</option>
              ))}
            </select>

            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Diagnóstico (Historial)</th>
                  <th>Receta Prescrita</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {consultas
                  .filter((con) => filtroPaciente === '' || con.paciente_id.toString() === filtroPaciente)
                  .map((con) => (
                    <tr key={con.id}>
                      <td>{con.fecha}</td>
                      <td>{con.paciente_nombre}</td>
                      <td>Dr. {con.medico_nombre}</td>
                      <td>{con.diagnostico}</td>
                      <td>{con.receta}</td>
                      <td>
                        <button className="btn-imprimir" onClick={() => mandarAImprimir(con)}>
                           Imprimir Receta
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* PLANTILLA DE IMPRESIÓN DE RECETA (Visible al seleccionar una receta) */}
          {recetaActiva && (
            <div className="receta-impresion">
              <div className="receta-encabezado">
                <h2>CLÍNICA MÉDICA INTEGRAL</h2>
                <p>Receta e Indicaciones Médicas</p>
              </div>
              <p><strong>Fecha de Emisión:</strong> {recetaActiva.fecha}</p>
              <p><strong>Médico Tratante:</strong> Dr. {recetaActiva.medico_nombre} ({recetaActiva.especialidad})</p>
              <p><strong>Paciente:</strong> {recetaActiva.paciente_nombre} | <strong>Contacto:</strong> {recetaActiva.telefono}</p>
              <hr />
              <h3>Diagnóstico:</h3>
              <p>{recetaActiva.diagnostico}</p>
              <h3>Rx (Medicamentos e Indicaciones):</h3>
              <p style={{ whiteSpace: 'pre-line', fontSize: '16px', fontWeight: 'bold' }}>
                {recetaActiva.receta}
              </p>
              <div className="receta-firma">
                <p>________________________________________</p>
                <p>Firma y Sello: Dr. {recetaActiva.medico_nombre}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;