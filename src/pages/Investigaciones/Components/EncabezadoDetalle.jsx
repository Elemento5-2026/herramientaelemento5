export default function EncabezadoDetalle({

  investigacion

}) {

  return (

    <div className="detalle-card">

      <h2>

        Encabezado

      </h2>

      <div className="detalle-grid">

        <div className="detalle-item">

          <label>

            Código controlado

          </label>

          <span>

            {investigacion.codigo_controlado || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Participantes

          </label>

          <span>

            {investigacion.participantes || "-"}

          </span>

        </div>

      </div>

      <br />

      <div className="detalle-grid">

        <div className="detalle-item">

          <label>

            Elaboró

          </label>

          <span>

            {investigacion.elaborado_nombre || "-"}

          </span>

          <span>

            {investigacion.elaborado_puesto || "-"}

          </span>

          <span>

            {investigacion.elaborado_gerencia || "-"}

          </span>

          <span>

            {investigacion.elaborado_area || "-"}

          </span>

          <span>

            {investigacion.elaborado_fecha || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Revisó

          </label>

          <span>

            {investigacion.revisado_nombre || "-"}

          </span>

          <span>

            {investigacion.revisado_puesto || "-"}

          </span>

          <span>

            {investigacion.revisado_gerencia || "-"}

          </span>

          <span>

            {investigacion.revisado_area || "-"}

          </span>

          <span>

            {investigacion.revisado_fecha || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Aprobó

          </label>

          <span>

            {investigacion.aprobado_nombre || "-"}

          </span>

          <span>

            {investigacion.aprobado_puesto || "-"}

          </span>

          <span>

            {investigacion.aprobado_gerencia || "-"}

          </span>

          <span>

            {investigacion.aprobado_area || "-"}

          </span>

          <span>

            {investigacion.aprobado_fecha || "-"}

          </span>

        </div>

      </div>

    </div>

  );

}
