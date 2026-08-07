import React from 'react';

export default function PlanAccionDetalle({ investigacion }) {

  const planAccion = investigacion?.plan_accion || [];

  if (planAccion.length === 0) {
    return (
      <div className="plan-accion-detalle">
        <h3>Plan de Acción</h3>
        <p className="empty-message">No hay acciones registradas.</p>
        <style>{`
          .plan-accion-detalle {
            padding: 16px 0;
          }
          .plan-accion-detalle h3 {
            margin-bottom: 16px;
            color: #1e293b;
          }
          .empty-message {
            text-align: center;
            color: #94a3b8;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }

  // ============================================
  // FUNCIÓN PARA CALCULAR ESTADO DE LA ACCIÓN
  // ============================================
  const getEstadoAccion = (accion) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Si tiene fecha_fin (cierre), está cerrada
    if (accion.fecha_fin) {
      return {
        estado: 'Cerrada',
        clase: 'cerrada',
        icono: '✅'
      };
    }

    // Si no tiene fecha_inicio, está pendiente
    if (!accion.fecha_inicio) {
      return {
        estado: 'Pendiente',
        clase: 'pendiente',
        icono: '⏳'
      };
    }

    // Si tiene fecha_propuesta, comparar
    if (accion.fecha_propuesta) {
      const fechaPropuesta = new Date(accion.fecha_propuesta);
      fechaPropuesta.setHours(0, 0, 0, 0);

      if (hoy > fechaPropuesta) {
        return {
          estado: 'Atrasada',
          clase: 'atrasada',
          icono: '🔴'
        };
      } else {
        return {
          estado: 'En Proceso',
          clase: 'en-proceso',
          icono: '🟡'
        };
      }
    }

    // Si tiene fecha_inicio pero no fecha_propuesta
    return {
      estado: 'En Proceso',
      clase: 'en-proceso',
      icono: '🟡'
    };
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="plan-accion-detalle">
      <h3>Plan de Acción</h3>

      <div className="plan-accion-table-wrap">
        <table className="plan-accion-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Qué hacer</th>
              <th>Cómo</th>
              <th>Responsable</th>
              <th>Fecha inicio</th>
              <th>Fecha propuesta</th>
              <th>Fecha cierre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {planAccion.map((accion, index) => {
              const estado = getEstadoAccion(accion);
              return (
                <tr key={accion.id || index}>
                  <td>{index + 1}</td>
                  <td>{accion.que_hacer || '-'}</td>
                  <td>{accion.como || '-'}</td>
                  <td>{accion.responsable || '-'}</td>
                  <td>{formatFecha(accion.fecha_inicio)}</td>
                  <td>{formatFecha(accion.fecha_propuesta)}</td>
                  <td>{formatFecha(accion.fecha_fin)}</td>
                  <td>
                    <span className={`estado-badge ${estado.clase}`}>
                      {estado.icono} {estado.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .plan-accion-detalle {
          padding: 16px 0;
        }

        .plan-accion-detalle h3 {
          margin-bottom: 16px;
          color: #1e293b;
        }

        .plan-accion-table-wrap {
          overflow-x: auto;
        }

        .plan-accion-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .plan-accion-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #1e293b;
          padding: 10px 12px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }

        .plan-accion-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .plan-accion-table tr:hover {
          background: #f8fafc;
        }

        .estado-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .estado-badge.cerrada {
          background: #dcfce7;
          color: #166534;
        }

        .estado-badge.en-proceso {
          background: #fef3c7;
          color: #92400e;
        }

        .estado-badge.atrasada {
          background: #fee2e2;
          color: #991b1b;
        }

        .estado-badge.pendiente {
          background: #f1f5f9;
          color: #475569;
        }

        .empty-message {
          text-align: center;
          color: #94a3b8;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
