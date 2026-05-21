export default function TablaItems({ items, onEliminarItem }) {
    if (items.length === 0) {
        return (
            <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                No hay productos en este presupuesto.
            </p>
        );
    }

    // --- LÓGICA DE CÁLCULOS ACUMULADOS ---
    const totales = items.reduce(
        (acumulador, item) => {
            const subtotalItem = item.precio * item.cantidad;
            const descuentoItem = subtotalItem * (item.descuento / 100);
            const totalItem = subtotalItem - descuentoItem;

            return {
                subtotal: acumulador.subtotal + subtotalItem,
                descuento: acumulador.descuento + descuentoItem,
                neto: acumulador.neto + totalItem,
            };
        },
        { subtotal: 0, descuento: 0, neto: 0 } // Valores iniciales
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-100">
                            <th className="p-4">Código</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4 text-right">Precio U.</th>
                            <th className="p-4 text-center">Cant.</th>
                            <th className="p-4 text-center">Desc.</th>
                            <th className="p-4 text-right">Total Item</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                        {items.map((item) => {
                            const subtotal = item.precio * item.cantidad;
                            const ahorro = subtotal * (item.descuento / 100);
                            const totalFila = subtotal - ahorro;

                            return (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{item.codigo}</td>
                                    <td className="p-4">{item.nombre}</td>
                                    <td className="p-4 text-right">${item.precio.toFixed(2)}</td>
                                    <td className="p-4 text-center">{item.cantidad}</td>
                                    <td className="p-4 text-center text-green-600 font-medium">{item.descuento}%</td>
                                    <td className="p-4 text-right font-semibold">${totalFila.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => onEliminarItem(item.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- NUEVO BLOQUE DE RESUMEN FINAL (TOTALES) --- */}
            <div className="border-t border-gray-100 p-6 bg-gray-50/50 flex justify-end">
                <div className="w-64 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Subtotal General:</span>
                        <span className="font-medium text-gray-900">${totales.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Descuento Total:</span>
                        <span>-${totales.descuento.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                        <span>Neto a Pagar:</span>
                        <span className="text-blue-600">${totales.neto.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}