import React, { useState } from 'react';
import { STAGES } from '../utils/constans';
import { FaPhoneAlt, FaTag, FaRegUser, FaClipboardList, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa'; // Iconos para los placeholders

const RepairForm = ({ addRepair, repairs = [], deleteRepair }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    brand: '',
    model: '',
    contact: '',
    address: '',
    issue: '',
    price: '',
  });

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [repairToDelete, setRepairToDelete] = useState(null);

  // Función para formatear la fecha
  const timeAgo = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('es-CR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contact') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4) + '-' + formattedValue.slice(4, 8);
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'price') {
      const formattedPrice = value.replace(/[^0-9.,]/g, '');
      setFormData((prev) => ({ ...prev, [name]: formattedPrice }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.issue || !formData.contact || !formData.price) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (formData.contact.replace(/\D/g, '').length !== 8) {
      alert('El contacto debe tener 8 dígitos.');
      return;
    }

    const price = parseFloat(formData.price.replace(/[^0-9.]/g, ''));
    if (isNaN(price) || price <= 0) {
      alert('Por favor, ingresa un precio válido.');
      return;
    }

    const repair = {
      ...formData,
      id: Date.now(),
      stage: STAGES.PENDING,
      comments: [],
      createdAt: new Date().toISOString(),
      price: price.toLocaleString(),
    };

    addRepair(repair);

    setFormData({
      clientName: '',
      brand: '',
      model: '',
      contact: '',
      address: '',
      issue: '',
      price: '',
    });
  };

  const handleDeleteClick = (repairId) => {
    setRepairToDelete(repairId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (repairToDelete) {
      deleteRepair(repairToDelete);
    }
    setShowConfirmDelete(false);
    setRepairToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowConfirmDelete(false);
    setRepairToDelete(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Nombre del Cliente */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Nombre del Cliente</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaRegUser />
            </span>
            <input
              type="text"
              className="form-control"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              required
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Contacto</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaPhoneAlt />
            </span>
            <input
              type="text"
              className="form-control"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="xxxx-xxxx"
              maxLength="9" // Limitar a 9 caracteres (incluyendo el guion)
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Dirección</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaMapMarkerAlt />
            </span>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección"
            />
          </div>
        </div>

        {/* Problema */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Problema</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaClipboardList />
            </span>
            <input
              type="text"
              className="form-control"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              placeholder="Descripción del problema"
              required
            />
          </div>
        </div>

        {/* Precio */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Precio</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaDollarSign />
            </span>
            <input
              type="text"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Precio en colones"
              required
            />
          </div>
        </div>

        {/* Marca */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Marca</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaTag />
            </span>
            <input
              type="text"
              className="form-control"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Marca"
            />
          </div>
        </div>

        {/* Modelo */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Modelo</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#f0f0f0' }}>
              <FaTag />
            </span>
            <input
              type="text"
              className="form-control"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Modelo"
            />
          </div>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            backgroundColor: '#a10000',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Agregar Reparación
        </button>
      </form>

      {/* Confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="confirmation-modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div className="confirmation-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            width: '300px',
          }}>
            <p>¿Estás seguro de que quieres eliminar esta reparación?</p>
            <button
              onClick={handleDeleteConfirm}
              style={{
                backgroundColor: '#a10000',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Sí
            </button>
            <button
              onClick={handleDeleteCancel}
              style={{
                backgroundColor: '#ccc',
                color: 'black',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Listado de Reparaciones */}
      <div style={{ marginTop: '20px' }}>
        {Array.isArray(repairs) && repairs.map((repair) => (
          <div key={repair.id} style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p><strong>Cliente:</strong> {repair.clientName}</p>
              <p><strong>Problema:</strong> {repair.issue}</p>
              <p><strong>Precio:</strong> {repair.price} colones</p>
              <p><strong>Tiempo:</strong> {timeAgo(repair.createdAt)}</p>
            </div>
            <button
              onClick={() => handleDeleteClick(repair.id)}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairForm;
