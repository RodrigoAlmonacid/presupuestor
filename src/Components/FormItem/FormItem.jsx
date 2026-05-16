import { useState } from 'react';

export default function FormItem({ onAgregarItem }) {
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    cantidad: 1,
    descuento: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Pasamos los datos limpios al componente padre
    onAgregarItem({
      codigo: form.codigo,
      nombre: form.nombre,
      precio: parseFloat(form.precio) || 0,
      cantidad: parseInt(form.cantidad) || 1,
      descuento: parseFloat(form.descuento) || 0,
    });

    // Resetear el formulario interno
    setForm({ codigo: '', nombre: '', precio: '', cantidad: 1, descuento: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
        <input type="text" name="codigo" value={form.codigo} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unit.</label>
        <input type="number" name="precio" value={form.precio} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cant.</label>
        <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
        <input type="number" name="descuento" value={form.descuento} onChange={handleChange} className="w-full border p-2 rounded-lg" />
      </div>
      
      {/* Botón de acción integrado aquí */}
      <div className="md:col-span-5 flex justify-end">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm">
          Agregar Producto
        </button>
      </div>
    </form>
  );
}