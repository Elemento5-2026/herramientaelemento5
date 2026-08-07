import React, { useState } from 'react';
import './EstadoSelector.css';

const ESTADOS = ['Borrador', 'En revisión', 'Aprobado', 'Cerrado'];

const TRANSICIONES_VALIDAS = {
  'Borrador': ['En revisión', 'Cerrado'],
  'En revisión': ['Aprobado', 'Borrador'],
  'Aprobado': ['Cerrado'],
  'Cerrado': []
};

export default function EstadoSelector({
  estadoActual,
  onChangeEstado,
  readOnly = false
}) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const estadosDisponibles = TRANSICIONES_VALIDAS[estadoActual] || [];
  const puedeCambiar = estadosDisponibles.length > 0 && !readOnly;

  const getColorEstado = (estado) => {
    const colores = {
      'Borrador': '#F59E0B',
      'En revisión': '#3B82F6',
      'Aprobado': '#10B981',
      'Cerrado': '#6B7280'
    };
    return colores[estado] || '#6B7280';
  };

  const handleCambioEstado = (nuevoEstado) => {
    if (readOnly) return;
    if (estadosDisponibles.includes(nuevoEstado)) {
      onChangeEstado(nuevoEstado);
      setMostrarMenu(false);
    }
  };

  return (
    <div className="estado-selector">
      <div className="estado-selector-current">
        <span
          className="estado-badge"
          style={{ backgroundColor: getColorEstado(estadoActual) }}
        >
          {estadoActual}
        </span>
        {puedeCambiar && (
          <button
            className="estado-selector-btn"
            onClick={() => setMostrarMenu(!mostrarMenu)}
          >
            ▼
          </button>
        )}
      </div>

      {mostrarMenu && !readOnly && (
        <div className="estado-selector-menu">
          <div className="estado-selector-header">
            <span>Cambiar estado</span>
            <button onClick={() => setMostrarMenu(false)}>✕</button>
          </div>
          <div className="estado-selector-list">
            {estadosDisponibles.map((estado) => (
              <button
                key={estado}
                className="estado-selector-option"
                onClick={() => handleCambioEstado(estado)}
              >
                <span
                  className="estado-dot"
                  style={{ backgroundColor: getColorEstado(estado) }}
                />
                {estado}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
