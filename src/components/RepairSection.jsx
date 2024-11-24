import React, { useState } from 'react';
import RepairCard from './RepairCard';

const RepairSection = ({ title, repairs, allowComments, onAddComment, moveRepair, generateInvoice }) => {
  const [isOpen, setIsOpen] = useState(true); // Estado para alternar el desplegable
  const sectionClass = title === "Pendientes" ? "bg-danger" :
                       title === "En Reparación" ? "bg-warning" : "bg-success";

  // Cálculo del contador para cada sección
  const repairCount = repairs.length;

  return (
    <div className={`mb-4 ${sectionClass} text-white p-3 rounded`}>
      <button
        className="btn btn-light w-100 text-start d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{isOpen ? `▼ ${title}` : `► ${title}`}</span>
        <span className="badge bg-light text-dark">{repairCount}</span>
      </button>

      {isOpen && (
        <div className="mt-3">
          {repairs.length > 0 ? (
            repairs.map((repair, index) => (
              <RepairCard
                key={repair.id || index} // Asegúrate de que cada 'repair' tenga un 'id' único
                repair={repair}
                allowComments={allowComments}
                onAddComment={onAddComment}
                onMove={() => moveRepair(repair)} 
                generateInvoice={generateInvoice}
                 // Pasamos la función de generar factura
              />
            ))
          ) : (
            <p className="text-muted">No hay reparaciones en esta sección.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairSection;
