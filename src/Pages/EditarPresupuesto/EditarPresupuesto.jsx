import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatosGenerales from './../../Components/DatosGenerales/DatosGenerales';
import FormItem from './../../Components/FormItem/FormItem';
import TablaItems from './../../Components/TablaItems/TablaItems';
import BotonExport from './../../Components/BotonExport/BotonExport';

export default function EditarPresupuesto() {
  const { id } = useParams(); // ID del presupuesto que viene de la URL
  const navigate = useNavigate();

  // 1. Precargamos los datos generales buscando por ID
  const [datosGenerales, setDatosGenerales] = useState(() => {
    const historial = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const encontrado = historial.find(p => p.id === id);
    return encontrado 
      ? { cliente: encontrado.cliente, vendedor: encontrado.vendedor, fecha: encontrado.fecha }
      : { cliente: '', vendedor: '', fecha: new Date().toISOString().split('T')[0] };
  });

  // 2. Precargamos los renglones (ítems) buscando por ID
  const [items, setItems] = useState(() => {
    const historial = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const encontrado = historial.find(p => p.id === id);
    return encontrado ? encontrado.items : [];
  });

  // --- EFECTO DE AUTO-GUARDADO (Sincronizado con NuevoPresupuesto) ---
  useEffect(() => {
    // Si no hay ítems, el borrado total lo maneja handleEliminarItem para evitar conflictos
    if (items.length === 0) return;

    // Calcular el neto actual
    const netoTotal = items.reduce((acc, item) => {
      const subtotal = item.precio * item.cantidad;
      return acc + (subtotal - (subtotal * (item.descuento / 100)));
    }, 0);

    const historialPrevio = JSON.parse(localStorage.getItem('presupuestos')) || [];

    const presupuestoActualizado = {
      id: id, // Mantenemos el ID original bajo el cual se está editando
      cliente: datosGenerales.cliente.trim() || 'Cliente sin nombre',
      vendedor: datosGenerales.vendedor.trim() || 'Vendedor sin nombre',
      fecha: datosGenerales.fecha,
      items: items,
      neto: netoTotal
    };

    // Buscamos la posición en el array y lo reemplazamos
    const index = historialPrevio.findIndex(p => p.id === id);
    if (index !== -1) {
      historialPrevio[index] = presupuestoActualizado;
      localStorage.setItem('presupuestos', JSON.stringify(historialPrevio));
    }
  }, [items, datosGenerales, id]);


  // --- FUNCIONES DE CONTROL (Clones exactos de NuevoPresupuesto) ---
  
  const handleDatosGeneralesChange = (e) => {
    const { name, value } = e.target;
    setDatosGenerales({ ...datosGenerales, [name]: value });
  };

  const handleAgregarItem = (nuevoItem) => {
    setItems([...items, { ...nuevoItem, id: crypto.randomUUID() }]);
  };

  const handleEliminarItem = (idItem) => {
    const nuevaLista = items.filter(item => item.id !== idItem);
    setItems(nuevaLista);

    // SÚPER IMPORTANTE: Si borra la última línea editando, lo quitamos del historial
    if (nuevaLista.length === 0) {
      const historialPrevio = JSON.parse(localStorage.getItem('presupuestos')) || [];
      const historialFiltrado = historialPrevio.filter(p => p.id !== id);
      localStorage.setItem('presupuestos', JSON.stringify(historialFiltrado));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">✏️ Editar Presupuesto</h1>
      
      {/* Pasamos 'datos' para que sepa qué mostrar e 'onChangeDatos' para capturar los cambios */}
      <DatosGenerales datos={datosGenerales} onChangeDatos={handleDatosGeneralesChange} />
      
      <FormItem onAgregarItem={handleAgregarItem} />
      
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Resumen del Presupuesto</h3>
      <TablaItems items={items} onEliminarItem={handleEliminarItem} />
      
      <div className="mt-6 flex gap-4 justify-end">
        <BotonExport datosGenerales={datosGenerales} items={items} />
        <button 
          onClick={() => navigate('/historial')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          Volver al Historial
        </button>
      </div>
    </div>
  );
}