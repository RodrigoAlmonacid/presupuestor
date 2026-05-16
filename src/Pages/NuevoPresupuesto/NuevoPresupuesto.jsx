import { useState } from 'react';
import DatosGenerales from './../../Components/DatosGenerales/DatosGenerales';
import FormItem from './../../Components/FormItem/FormItem';
import TablaItems from './../../Components/TablaItems/TablaItems';
import BotonExport from './../../Components/BotonExport/BotonExport';

export default function NuevoPresupuesto() {
  const [datosGenerales, setDatosGenerales] = useState({ cliente: '', vendedor: '', fecha: '' });
  const [items, setItems] = useState([]);

  // Manejar cambios de cliente/vendedor
  const handleDatosGeneralesChange = (e) => {
    const { name, value } = e.target;
    setDatosGenerales({ ...datosGenerales, [name]: value });
  };

  // Agregar un producto al array
  const handleAgregarItem = (nuevoItem) => {
    setItems([...items, { ...nuevoItem, id: crypto.randomUUID() }]);
  };

  // Eliminar un producto del array
  const handleEliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Crear Nuevo Presupuesto</h2>
      
      {/* 1. Datos del Cliente */}
      <DatosGenerales onChangeDatos={handleDatosGeneralesChange} />
      
      {/* 2. Formulario para añadir items */}
      <FormItem onAgregarItem={handleAgregarItem} />
      
      {/* 3. Tabla con los items agregados */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Resumen del Presupuesto</h3>
      <TablaItems items={items} onEliminarItem={handleEliminarItem} />
      
      {/* Aquí irá más adelante tu componente BotonExport.jsx */}
      <div className="mt-6 flex justify-end">
        <BotonExport datosGenerales={datosGenerales} items={items} />
      </div>
    </div>
  );
}