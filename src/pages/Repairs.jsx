import React, { useState, useEffect } from 'react';
import RepairForm from '../components/RepairForm';
import RepairSection from '../components/RepairSection';
import { openDB, getData, saveData } from '../utils/indexedDB';
import { STAGES } from '../utils/constans';
import { jsPDF } from 'jspdf';
import logo2 from '../img/logo2.png';
import logo from '../img/logo.jpg';


const Repairs = () => {
  const [repairs, setRepairs] = useState({
    pending: [],
    inProgress: [],
    completed: [],
  });

  // Cargar reparaciones al montar el componente
  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      const db = await openDB('RepairDB', 1);
      const savedRepairs = await getData(db, 'repairs');

      const pending = savedRepairs.filter((repair) => repair.stage === STAGES.PENDING);
      const inProgress = savedRepairs.filter((repair) => repair.stage === STAGES.IN_PROGRESS);
      const completed = savedRepairs.filter((repair) => repair.stage === STAGES.COMPLETED);

      setRepairs({ pending, inProgress, completed });
    } catch (error) {
      console.error('Error al cargar las reparaciones:', error);
    }
  };
  const handleAddComment = async (repairId, comment) => {
    const updatedRepairs = { ...repairs };
    const repair = updatedRepairs.inProgress.find(r => r.id === repairId);

    if (repair) {
      repair.comments.push(comment);
      try {
        const db = await openDB('RepairDB', 1);
        await saveData(db, 'repairs', repair);

        // Actualiza el estado de las reparaciones
        setRepairs(updatedRepairs);

        console.log('Comentario agregado con éxito');
      } catch (error) {
        console.error('Error al guardar el comentario:', error);
      }
    }
  };

  const generateInvoice = (repair) => {
    const doc = new jsPDF();
  
    // Añadir logo en la esquina superior izquierda
    doc.addImage(logo2, 'PNG', 10, 10, 50, 20); // 10, 10 son las coordenadas, 50, 20 es el tamaño del logo
  
    // Título de la factura debajo del logo (sin línea aún)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Reparación', 60, 40); // Título centrado debajo del logo
  
    // Información del cliente (encabezado de la factura)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${repair.clientName}`, 10, 50);
    doc.text(`Teléfono: ${repair.contact}`, 10, 60);
    doc.text(`Dirección: ${repair.address}`, 10, 70);
  
    // Línea de separación después de la información del cliente
    doc.line(10, 75, 200, 75); // Línea de separación después de la información del cliente
  
    // Detalles de la reparación (detalles de la reparación en una tabla)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de la Reparación', 10, 85);
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Marca: ${repair.brand}`, 10, 95);
    doc.text(`Modelo: ${repair.model}`, 10, 105);
    doc.text(`Motivo: ${repair.issue}`, 10, 115);
  
  // Tabla con comentarios (si hay comentarios)
  if (repair.comments.length > 0) {
    const y = 125; // Definir la posición inicial para los comentarios
    doc.text('Comentario:', 10, y); // Etiqueta para el comentario
    doc.text(`- ${repair.comments[0]}`, 10, y + 10); // Mostrar el comentario
  }
  
    // Precio de la reparación y resumen
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Precio: ${repair.price} colones`, 10, 145);
  
    // Fecha de emisión
    const date = new Date().toLocaleDateString();
    doc.text(`Fecha de emisión: ${date}`, 10, 155);
  
    // Línea de separación antes del pie de página
    doc.line(10, 160, 200, 160); // Línea de separación antes del pie de página
  
    // Pie de página con datos de contacto
    doc.setFontSize(10);
    doc.text("Gracias por confiar en nosotros.", 10, 170);
    doc.text("Dirección de la tienda: Provincia de Puntarenas, El Roble,", 10, 180);
    doc.text("Teléfono: 6034-6640 / 6023-7377", 10, 190);
  
    // Convertir el PDF a un blob para poder compartirlo
    const pdfOutput = doc.output('blob');
  
    // Verificar si la API de compartir está disponible y manejar el caso de error
    if (navigator.share) {
      try {
        navigator.share({
          title: `Factura de Reparación - ${repair.clientName}`,
          text: 'Aquí está la factura de la reparación realizada.',
          files: [
            new File([pdfOutput], `${repair.clientName}_Factura.pdf`, {
              type: 'application/pdf',
            }),
          ],
        })
          .then(() => console.log('Factura compartida correctamente.'))
          .catch((error) => {
            console.error('Error al compartir la factura:', error);
            // Si no se puede compartir, solo descarga la factura
            doc.save(`${repair.clientName}_Factura.pdf`);
          });
      } catch (error) {
        console.error('Error en el intento de compartir:', error);
        // En caso de error, solo descargar el archivo
        doc.save(`${repair.clientName}_Factura.pdf`);
      }
    } else {
      // Si la API de compartir no está disponible, solo descargar el archivo
      doc.save(`${repair.clientName}_Factura.pdf`);
    }
  };
  const addRepair = async (repair) => {
    try {
      const db = await openDB('RepairDB', 1);
      await saveData(db, 'repairs', repair);

      setRepairs((prev) => ({
        ...prev,
        pending: [...prev.pending, repair],
      }));
    } catch (error) {
      console.error('Error al agregar la reparación:', error);
    }
  };

  const moveRepair = async (from, to, repair) => {
    const updatedRepair = { ...repair, stage: to };

    try {
      const db = await openDB('RepairDB', 1);
      await saveData(db, 'repairs', updatedRepair);

      setRepairs((prev) => ({
        ...prev,
        [from]: prev[from].filter((r) => r.id !== repair.id),
        [to]: [...prev[to], updatedRepair],
      }));
    } catch (error) {
      console.error('Error al mover la reparación:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div><img src={logo} alt="Logo de Brikocell" style={{ maxWidth: '150px', marginBottom: '20px' }}/></div>
      <h2>Gestión de Reparaciones</h2>
      <RepairForm addRepair={addRepair} />
      <div className="mt-4">
        <RepairSection
          title="Pendientes"
          repairs={repairs.pending}
          moveRepair={(repair) => moveRepair('pending', 'inProgress', repair)}
        />
        <RepairSection
          title="En Reparación"
          repairs={repairs.inProgress}
          allowComments={true}
          onAddComment={handleAddComment}
          moveRepair={(repair) => moveRepair('inProgress', 'completed', repair)}
        />
        <RepairSection
          title="Completados"
          repairs={repairs.completed}
          moveRepair={(repair) => moveRepair('completed', 'completed', repair)}
          generateInvoice={generateInvoice}
        />
      </div>
    </div>
  );
};

export default Repairs;
