import { useEffect, useState } from "react";
import "./Descripcion.css";

import { obtenerCatalogo } from "../../../services/catalogosService";

export default function Descripcion({

  formulario,
  setFormulario

}) {

  const [partesCuerpo, setPartesCuerpo] = useState([]);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {

    try {

      const data = await obtenerCatalogo(
        "catalogo_partes_cuerpo"
      );

      setPartesCuerpo(data);

    } catch (error) {

      console.error(error);

      alert("Error al cargar las partes del cuerpo.");

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });

  };

  return (

    <div className="descripcion">

      <div className="form-row">

        <label>Descripción del incidente</label>

        <textarea
          name="descripcion_incidente"
          rows={8}
          value={formulario.descripcion_incidente || ""}
          onChange={handleChange}
          placeholder="Describa detalladamente el incidente..."
        />

      </div>

      <div className="form-row">

        <label>Parte del cuerpo lesionada</label>

        <select
          name="parte_cuerpo_lesionada_id"
          value={formulario.parte_cuerpo_lesionada_id || ""}
          onChange={handleChange}
        >

          <option value="">Seleccione...</option>

          {partesCuerpo.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >
              {item.nombre}
            </option>

          ))}

        </select>

      </div>

      <div className="form-row">

        <label>Evidencias fotográficas</label>

        <div className="dropzone">

          <div className="dropzone-icon">
            📷
          </div>

          <h3>Agregar fotografías</h3>

          <p>
            Arrastre imágenes aquí o haga clic para seleccionarlas.
          </p>

          <button
            type="button"
            className="btn-upload"
          >
            Seleccionar archivos
          </button>

        </div>

      </div>

    </div>

  );

}
