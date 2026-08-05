export default function InformacionGeneralDetalle({

  incidente

}) {

  return (

    <div className="card">

      <h2>

        Información General

      </h2>

      <div className="form-grid">

        <div className="form-group">

          <label>

            Dirección

          </label>

          <input

            value={
              incidente.catalogo_direcciones?.nombre || ""
            }

            disabled

          />

        </div>

        <div className="form-group">

          <label>

            Sede

          </label>

          <input

            value={
              incidente.catalogo_sedes?.nombre || ""
            }

            disabled

          />

        </div>

        <div className="form-group">

          <label>

            Sección

          </label>

          <input

            value={incidente.seccion || ""}

            disabled

          />

        </div>

        <div className="form-group">

          <label>

            Ubicación

          </label>

          <input

            value={incidente.ubicacion || ""}

            disabled

          />

        </div>

      </div>

    </div>

  );

}
