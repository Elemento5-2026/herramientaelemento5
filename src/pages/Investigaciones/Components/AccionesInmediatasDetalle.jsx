export default function AccionesInmediatasDetalle({

  investigacion

}) {

  const acciones =
    investigacion.acciones_inmediatas || [];

  return (

    <div className="detalle-card">

      <h2>

        Acciones inmediatas

      </h2>

      {acciones.length === 0 ? (

        <p>

          No hay acciones inmediatas registradas.

        </p>

      ) : (

        <table className="tabla-detalle">

          <thead>

            <tr>

              <th>No.</th>

              <th>Acción inmediata</th>

              <th>Responsable</th>

              <th>Inicio</th>

              <th>Fin</th>

            </tr>

          </thead>

          <tbody>

            {acciones.map((accion) => (

              <tr key={accion.id}>

                <td>

                  {accion.numero}

                </td>

                <td>

                  {accion.accion_inmediata}

                </td>

                <td>

                  {accion.responsable}

                </td>

                <td>

                  {accion.fecha_inicio || "-"}

                </td>

                <td>

                  {accion.fecha_fin || "-"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}
