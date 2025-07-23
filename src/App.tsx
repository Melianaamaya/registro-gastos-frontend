import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Tipos
type Categoria = {
  id: number;
  nombre: string;
};

type Gasto = {
  id: number;
  descripcion: string;
  monto: string;
  fecha: string;
  categoria: Categoria;
  esCuota?: boolean;
  cuotaActual?: number | string;
  totalCuotas?: number | string;
};

function App() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [esCuota, setEsCuota] = useState(false);
  const [cuotaActual, setCuotaActual] = useState('');
  const [totalCuotas, setTotalCuotas] = useState('');

  const obtenerGastos = async () => {
    const response = await axios.get<Gasto[]>('http://localhost:3000/gastos');
    setGastos(response.data);
  };

  const obtenerCategorias = async () => {
    const response = await axios.get<Categoria[]>('http://localhost:3000/categorias');
    setCategorias(response.data);
  };

  useEffect(() => {
    obtenerGastos();
    obtenerCategorias();
  }, []);

  const agregarGasto = async () => {
    if (!descripcion || !monto || !fecha || !categoriaId) return;

    const nuevoGasto = {
      descripcion,
      monto,
      fecha,
      categoriaId,
      esCuota,
      cuotaActual: esCuota ? cuotaActual : undefined,
      totalCuotas: esCuota ? totalCuotas : undefined,
    };

    await axios.post('http://localhost:3000/gastos', nuevoGasto);

    setDescripcion('');
    setMonto('');
    setFecha('');
    setCategoriaId(null);
    setEsCuota(false);
    setCuotaActual('');
    setTotalCuotas('');
    obtenerGastos();
  };

  const eliminarGasto = async (id: number) => {
    await axios.delete(`http://localhost:3000/gastos/${id}`);
    obtenerGastos();
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria) return;
    await axios.post('http://localhost:3000/categorias', { nombre: nuevaCategoria });
    setNuevaCategoria('');
    obtenerCategorias();
  };

  const eliminarCategoria = async (id: number) => {
    await axios.delete(`http://localhost:3000/categorias/${id}`);
    obtenerCategorias();
  };

  return (
    <div className="App">
      <h1>Registro de Gastos</h1>

      <button onClick={() => setMostrarCategorias(true)} className="btn-categorias">
        Categorías
      </button>

      <section className="gastos-form">
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <select
          value={categoriaId ?? ''}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={esCuota}
            onChange={(e) => setEsCuota(e.target.checked)}
          />
          ¿Es en cuotas?
        </label>

        {esCuota && (
          <>
            <input
              type="number"
              placeholder="Cuota actual"
              value={cuotaActual}
              onChange={(e) => setCuotaActual(e.target.value)}
            />
            <input
              type="number"
              placeholder="Total de cuotas"
              value={totalCuotas}
              onChange={(e) => setTotalCuotas(e.target.value)}
            />
          </>
        )}

        <button onClick={agregarGasto}>Agregar gasto</button>
      </section>

      <div className="gastos-lista">
        <h2>Gastos Registrados</h2>
        <table className="tabla-gastos">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Cuotas</th> {/* Columna nueva */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td>{gasto.descripcion}</td>
                <td>${gasto.monto}</td>
                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                <td>{gasto.categoria?.nombre || 'Sin categoría'}</td>
                <td>
                  {gasto.esCuota
                    ? `${gasto.cuotaActual ?? '0'}/${gasto.totalCuotas ?? '0'}`
                    : 'No'}
                </td>
                <td>
                  <button onClick={() => eliminarGasto(gasto.id)} className="btn-danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarCategorias && (
        <div className="modal">
          <div className="modal-content">
            <button className="cerrar-modal" onClick={() => setMostrarCategorias(false)}>
              ❌
            </button>
            <h2>Administrar Categorías</h2>
            <div className="categoria-form">
              <input
                type="text"
                placeholder="Nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <button onClick={agregarCategoria}>Agregar</button>
            </div>
            <div className="categoria-lista">
              {categorias.map((cat) => (
                <div className="categoria-item" key={cat.id}>
                  <span>{cat.nombre}</span>
                  <button onClick={() => eliminarCategoria(cat.id)} className="btn-danger">
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
