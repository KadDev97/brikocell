import React, { useState } from "react";
import { STAGES } from '../utils/constans';
import { openDB, saveData } from "../utils/indexedDB";
import { FaFileInvoice } from 'react-icons/fa'; // Icono de factura

function RepairCard({ repair, onMove, allowComments, onAddComment, generateInvoice }) {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false); // Estado para controlar si la tarjeta está expandida

  const handleAddComment = async () => {
    if (comment.trim()) {
      const updatedRepair = {
        ...repair,
        comments: [...repair.comments, comment],
      };
  
      try {
        const db = await openDB("RepairDB", 1);
        await saveData(db, "repairs", updatedRepair);
  
        // Llamar a la función onAddComment pasada por las props
        onAddComment(repair.id, comment); // Asegúrate de que esta función esté disponible
  
        // Mostrar el mensaje de éxito y limpiar el comentario
        setMessage("Comentario agregado con éxito");
        setTimeout(() => setMessage(""), 3000); // Ocultar el mensaje después de 3 segundos
        setComment(""); // Limpiar el campo de comentario
      } catch (error) {
        console.error("Error al guardar el comentario:", error);
      }
    }
  };

  const handleMoveToNextStage = async () => {
    let nextStage = '';

    switch (repair.stage) {
      case STAGES.PENDING:
        nextStage = STAGES.IN_PROGRESS;
        break;
      case STAGES.IN_PROGRESS:
        nextStage = STAGES.COMPLETED;
        break;
      default:
        return;
    }

    const updatedRepair = {
      ...repair,
      stage: nextStage,
    };

    try {
      const db = await openDB("RepairDB", 1);
      await saveData(db, "repairs", updatedRepair);
      onMove(updatedRepair);
    } catch (error) {
      console.error("Error al mover la reparación:", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        maxWidth: "100%",
      }}
      className="card"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
          {repair.clientName}
        </h5>

        {/* Botón para expandir o contraer la tarjeta */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {expanded ? "←" : "…"}
        </button>
      </div>

      {/* Solo mostrar la marca, modelo y nombre cuando está comprimida */}
      <p style={{ margin: "4px 0", color: "#6c757d", fontSize: "14px" }}>
        {repair.brand} {repair.model}
      </p>

      {/* Mostrar la información completa solo si está expandida */}
      {expanded && (
        <>
          <p style={{ margin: "4px 0", color: "#6c757d", fontSize: "14px" }}>
            <strong>Contacto:</strong> {repair.contact}
          </p>
          <p style={{ margin: "4px 0", color: "#6c757d", fontSize: "14px" }}>
            <strong>Dirección:</strong> {repair.address}
          </p>
          <p style={{ margin: "4px 0", color: "#6c757d", fontSize: "14px" }}>
            <strong>Problema:</strong> {repair.issue}
          </p>
          <p style={{ margin: "4px 0", color: "#6c757d", fontSize: "14px" }}>
            <strong>Precio:</strong> ₡{repair.price}
          </p>
        </>
      )}

      {allowComments && (
        <div style={{ marginTop: "12px" }}>
          <textarea
            style={{
              width: "100%",
              resize: "none",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              backgroundColor: "#f5f5f5",
              color: "#333",
            }}
            rows="2"
            placeholder="Añadir comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleAddComment}
          >
            Añadir Comentario
          </button>
          {message && (
            <p
              style={{
                color: "green",
                marginTop: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: "12px" }}>
        {repair.stage !== "completed" && (
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleMoveToNextStage}
          >
            Mover a la siguiente etapa
          </button>
        )}

        {repair.stage === "completed" && generateInvoice && (
          <button 
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }} 
            onClick={() => generateInvoice(repair)}
          >
            <FaFileInvoice /> Generar Factura
          </button>
        )}
      </div>
    </div>
  );
}

export default RepairCard;
