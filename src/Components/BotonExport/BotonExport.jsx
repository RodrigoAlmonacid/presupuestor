import { jsPDF } from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import logo from './../../assets/favicon.png'

export default function BotonExport({ datosGenerales, items }) {
  
  const exportarAPdf = () => {
    // 1. Inicializar jsPDF (formato A4, medición en milímetros)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 2. Configurar fuentes y Diseñar Cabecera (Datos generales)
    doc.addImage(logo, 'PNG', 14, 12, 15, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // Color gris oscuro
    doc.text("PRESUPUESTO", 32, 22);

    // Línea decorativa superior
    doc.setDrawColor(37, 99, 235); // Azul primario
    doc.setLineWidth(1);
    doc.line(14, 34, 196, 34);

    // Bloque de metadatos (Fecha, hora, etc.)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    
    const fechaFormateada = datosGenerales.fecha || new Date().toISOString().split('T')[0];
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    doc.text(`Fecha: ${fechaFormateada}  |  Hora: ${horaActual}`, 14, 32);
    doc.text(`Vendedor: ${datosGenerales.vendedor || 'No especificado'}`, 14, 38);
    
    // Cuadro destacado para el Cliente
    doc.setFillColor(243, 244, 246); // Gris muy claro
    doc.roundedRect(14, 44, 182, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(`Cliente: ${datosGenerales.cliente || 'Consumidor Final'}`, 18, 51.5);

    // 3. Preparar los datos para jspdf-autotable
    const columnas = ["Código", "Descripción", "Precio U.", "Cant.", "Desc.", "Total"];
    
    let subtotalGeneral = 0;
    let descuentoTotal = 0;

    const filas = items.map(item => {
      const subtotalItem = item.precio * item.cantidad;
      const ahorroItem = subtotalItem * (item.descuento / 100);
      const totalItem = subtotalItem - ahorroItem;

      // Acumulamos para el bloque final del PDF
      subtotalGeneral += subtotalItem;
      descuentoTotal += ahorroItem;

      return [
        item.codigo,
        item.nombre,
        `$${item.precio.toFixed(2)}`,
        item.cantidad,
        `${item.descuento}%`,
        `$${totalItem.toFixed(2)}`
      ];
    });

    // 4. Renderizar la tabla en el PDF
    autoTable(doc, {
      startY: 62,
      head: [columnas],
      body: filas,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'right' }
      },
      styles: { font: "helvetica", fontSize: 9 }
    });

    // 5. Bloque de Totales al final de la tabla
    const finalY = doc.lastAutoTable.finalY + 10;
    const netoAPagar = subtotalGeneral - descuentoTotal;

    const xTotalesLabel = 140;
    const xTotalesValor = 196;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    
    // Aquí estaba el error (faltaba finalY)
    doc.text("Subtotal General:", xTotalesLabel, finalY);
    doc.text(`$${subtotalGeneral.toFixed(2)}`, xTotalesValor, finalY, { align: 'right' });

    doc.text("Descuento Total:", xTotalesLabel, finalY + 6);
    doc.setTextColor(22, 163, 74); 
    doc.text(`-$${descuentoTotal.toFixed(2)}`, xTotalesValor, finalY + 6, { align: 'right' });

    doc.setDrawColor(229, 231, 235);
    doc.line(xTotalesLabel, finalY + 9, xTotalesValor, finalY + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text("Neto a Pagar:", xTotalesLabel, finalY + 15);
    doc.text(`$${netoAPagar.toFixed(2)}`, xTotalesValor, finalY + 15, { align: 'right' });

    // 6. Descargar el archivo
    const nombreArchivo = `Presupuesto_${datosGenerales.cliente.replace(/\s+/g, '_') || 'Cliente'}.pdf`;
    doc.save(nombreArchivo);
  };

  return (
    <button
      onClick={exportarAPdf}
      disabled={items.length === 0}
      className={`w-full md:w-auto font-semibold px-6 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
        items.length === 0 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
          : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer active:scale-95'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar Presupuesto (PDF)
    </button>
  );
}