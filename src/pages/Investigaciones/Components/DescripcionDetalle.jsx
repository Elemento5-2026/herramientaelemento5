export default function DescripcionDetalle({

  investigacion

}) {

  return (

    <div className="detalle-card">

      <h2>

        Descripción del incidente

      </h2>

      <div className="detalle-grid">

        <div className="detalle-item">

          <label>

            Descripción del incidente

          </label>

          <span>

            {investigacion.descripcion_incidente || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Parte del cuerpo lesionada

          </label>

          <span>

            {investigacion.catalogo_partes_cuerpo?.nombre || "-"}

          </span>

        </div>

      </div>

      <div
        className="detalle-item"
        style={{ marginTop: "20px" }}
      >

        <label>

          Evidencias

        </label>

        <span>

          (Aquí mostraremos posteriormente las fotografías y archivos adjuntos.)

        </span>

      </div>

    </div>

  );

}
