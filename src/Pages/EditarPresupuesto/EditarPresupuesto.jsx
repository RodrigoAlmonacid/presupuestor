import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatosGenerales from './../../Components/DatosGenerales/DatosGenerales';
import FormItem from './../../Components/FormItem/FormItem';
import TablaItems from './../../Components/TablaItems/TablaItems';
import BotonExport from './../../Components/BotonExport/BotonExport';

export default function EditarPresupuesto() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Precargamos los datos generales buscando por ID
  const [datosGenerales, setDatosGenerales] = useState(() => {
    const historial = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const encontrado = historial.find(p => p.id === id);
    return encontrado 
      ? { cliente: encontrado.cliente, vendedor: encontrado.vendedor, fecha: encontrado.fecha }
      : { cliente: '', vendedor: '', fecha: new Date().toISOString().split('T')[0] };
  });

  // 3. Precargamos los renglones (ítems) buscando por ID
  const [items, setItems] = useState(() => {
    const historial = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const encontrado = historial.find(p => p.id === id);
    return encontrado ? encontrado.items : [];
  });

  useEffect(() => {
    if (items.length === 0) return;

    // Calculamos el nuevo total por si agregó o sacó cosas
    const netoTotal = items.reduce((acc, item) => {
      const subtotal = item.precio * item.cantidad;
      return acc + (subtotal - (subtotal * (item.descuento / 100)));
    }, 0);

    const historialPrevio = JSON.parse(localStorage.getItem('presupuestos')) || [];

    const presupuestoActualizado = {
      id: id, // Mantenemos el mismo ID original
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">✏️ Editar Presupuesto</h1>
      
      {/* Reutilizás exactamente los mismos componentes que en NuevoPresupuesto */}
      <DatosGenerales datos={datosGenerales} setDatos={setDatosGenerales} />
      <FormItem setItems={setItems} />
      <TablaItems items={items} setItems={setItems} />
      
      <div className="mt-6 flex gap-4">
        <BotonExport datosGenerales={datosGenerales} items={items} />
        <button 
          onClick={() => navigate('/historial')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Volver al Historial
        </button>
      </div>
    </div>
  );
}