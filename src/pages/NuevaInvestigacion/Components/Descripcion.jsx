import { useEffect, useState } from "react";
import "./Descripcion.css";

import { obtenerCatalogo } from "../../../services/catalogosService";

import Evidencias from "../../../components/Evidencias/Evidencias";

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

      // PRUEBA TEMPORAL
      const data = await obtenerCatalogo(
        "catalogo_gerencias"
      );

      console.log("DATA:", data);

      setPartesCuerpo(data);

    } catch (error) {

      console.error(error);

      alert("Error al cargar el catálogo.");

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

      <Evidencias
        titulo="Evidencias"
      />

    </div>

  );

}
