export default function PlanAccionDetalle({

  investigacion

}) {

  const acciones =
    investigacion.plan_accion || [];

  return (

    <div className="detalle-card">

      <h2>

        Plan de acción

      </h2>

      {acciones.length === 0 ? (

        <p>

          No hay acciones registradas.

        </p>

      ) : (

        <table className="tabla-detalle">

          <thead>

            <tr>

              <th>¿Qué hacer?</th>

              <th>¿Cómo?</th>

              <th>Responsable</th>

              <th>Inicio</th>

              <th>Fin</th>

            </tr>

          </thead>

          <tbody>

            {acciones.map((accion) => (

              <tr key={accion.id}>

                <td>

                  {accion.que_hacer}

                </td>

                <td>

                  {accion.como}

                </td>

                <td>

                  {accion.responsable}

                </td>

                <td>

                  {accion.fecha_plan_inicio || "-"}

                </td>

                <td>

                  {accion.fecha_plan_fin || "-"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}
