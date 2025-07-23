import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Categoria = {
  id: number;
  nombre: string;
};

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías desde backend
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Categoria[]>('http://localhost:3000/categorias');
      setCategorias(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Crear nueva categoría
  const agregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return alert('Ingrese un nombre válido');

    try {
      setLoading(true);
      await axios.post('http://localhost:3000/categorias', { nombre: nuevaCategoria });
      setNuevaCategoria('');
      fetchCategorias();
      setError(null);
    } catch {
      setError('Error al crear categoría');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (id: number) => {
    if (!window.confirm('¿Estás seguro que quieres eliminar esta categoría?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/categorias/${id}`);
      fetchCategorias();
      setError(null);
    } catch {
      setError('Error al eliminar categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Categorías</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Nueva categoría"
        value={nuevaCategoria}
        onChange={(e) => setNuevaCategoria(e.target.value)}
        disabled={loading}
      />
      <button onClick={agregarCategoria} disabled={loading}>
        Agregar
      </button>

      {loading && <p>Cargando...</p>}

      <ul>
        {categorias.map((cat) => (
          <li key={cat.id} style={{ marginTop: '0.5rem' }}>
            {cat.nombre}{' '}
            <button
              onClick={() => eliminarCategoria(cat.id)}
              disabled={loading}
              style={{ marginLeft: '1rem', color: 'red' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;
