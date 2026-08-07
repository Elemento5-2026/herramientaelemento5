import React from 'react';
import './PlanAccion.css';

export default function PlanAccion({
  formulario,
  setFormulario,
  readOnly = false
}) {

  const agregarAccion = () => {
    const nuevasAcciones = [...formulario.plan_accion, {
      id: Date.now(),
      que_hacer: '',
      como: '',
      responsable: '',
      fecha_inicio: '',
      fecha_fin: '',
      fecha_propuesta: '',
      evidencia: null
    }];
    setFormulario({ ...formulario, plan_accion: nuevasAcciones });
  };

  const eliminarAccion = (index) => {
    const nuevasAcciones = formulario.plan_accion.filter((_, i) => i !== index);
    setFormulario({ ...formulario, plan_accion: nuevasAcciones });
  };

  const actualizarAccion = (index, campo, valor) => {
    const nuevasAcciones = [...formulario.plan_accion];
    nuevasAcciones[index] = { ...nuevasAcciones[index], [campo]: valor };
    setFormulario({ ...formulario, plan_accion: nuevasAcciones });
  };

  return (
    <div className="plan-accion">
      <div className="plan-accion-header">
        <h3>Plan de Acción</h3>
        {!readOnly && (
          <button
            className="btn-primary"
            onClick={agregarAccion}
          >
            ➕ Agregar acción
          </button>
        )}
      </div>

      {formulario.plan_accion.length === 0 ? (
        <p className="empty-message">No hay acciones registradas.</p>
      ) : (
        <div className="plan-accion-list">
          {formulario.plan_accion.map((accion, index) => (
            <div key={accion.id || index} className="plan-accion-item">
              <div className="plan-accion-item-header">
                <h4>Acción #{index + 1}</h4>
                {!readOnly && (
                  <button
                    className="btn-danger"
                    onClick={() => eliminarAccion(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>¿Qué hacer?</label>
                <textarea
                  value={accion.que_hacer || ''}
                  onChange={(e) => actualizarAccion(index, 'que_hacer', e.target.value)}
                  disabled={readOnly}
                  rows="2"
                  placeholder="Describa la acción a realizar..."
                />
              </div>

              <div className="form-group">
                <label>¿Cómo hacerlo?</label>
                <textarea
                  value={accion.como || ''}
                  onChange={(e) => actualizarAccion(index, 'como', e.target.value)}
                  disabled={readOnly}
                  rows="2"
                  placeholder="Describa cómo se implementará..."
                />
              </div>

              <div className="form-group">
                <label>Responsable</label>
                <input
                  type="text"
                  value={accion.responsable || ''}
                  onChange={(e) => actualizarAccion(index, 'responsable', e.target.value)}
                  disabled={readOnly}
                  placeholder="Nombre del responsable"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>📅 Fecha inicio</label>
                  <input
                    type="date"
                    value={accion.fecha_inicio || ''}
                    onChange={(e) => actualizarAccion(index, 'fecha_inicio', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div className="form-group">
                  <label>📅 Fecha propuesta</label>
                  <input
                    type="date"
                    value={accion.fecha_propuesta || ''}
                    onChange={(e) => actualizarAccion(index, 'fecha_propuesta', e.target.value)}
                    disabled={readOnly}
                  />
                  <small className="help-text">
                    Fecha límite propuesta para completar la acción
                  </small>
                </div>

                <div className="form-group">
                  <label>📅 Fecha cierre</label>
                  <input
                    type="date"
                    value={accion.fecha_fin || ''}
                    onChange={(e) => actualizarAccion(index, 'fecha_fin', e.target.value)}
                    disabled={readOnly}
                  />
                  <small className="help-text">
                    Fecha real de cierre (se completa al finalizar)
                  </small>
                </div>
              </div>

              {!readOnly && (
                <div className="form-group">
                  <label>Evidencia (opcional)</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        actualizarAccion(index, 'evidencia', file);
                      }
                    }}
                    disabled={readOnly}
                  />
                  {accion.evidencia && (
                    <span className="file-name">
                      📎 {accion.evidencia.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .plan-accion {
          padding: 16px 0;
        }

        .plan-accion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .plan-accion-header h3 {
          margin: 0;
        }

        .plan-accion-item {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .plan-accion-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .plan-accion-item-header h4 {
          margin: 0;
          color: #1e293b;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          margin-bottom: 4px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .help-text {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .empty-message {
          text-align: center;
          color: #94a3b8;
          padding: 20px;
        }

        .file-name {
          display: inline-block;
          margin-top: 4px;
          font-size: 13px;
          color: #2563eb;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
