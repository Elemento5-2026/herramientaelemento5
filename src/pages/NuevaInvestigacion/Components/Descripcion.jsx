import { useEffect, useState } from "react";
import "./Descripcion.css";

import { obtenerCatalogo } from "../../../services/catalogosService";
import { guardarDescripcion } from "../../../services/investigacionesService";

import Evidencias from "../../../components/Evidencias/Evidencias";
import BotonGuardar from "../../../components/Form/BotonGuardar";

export default function Descripcion({

  investigacionId,
  descripcionId,
  setDescripcionId,

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

  const guardar = async () => {

    if (!investigacionId) {

      alert("Primero debe guardar el Encabezado.");

      return;

    }

    try {

      const data = await guardarDescripcion(

        investigacionId,
        formulario

      );

      setDescripcionId(data.id);

      alert("Descripción guardada correctamente.");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

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

      <BotonGuardar
        texto="Guardar descripción"
        onClick={guardar}
      />

      <Evidencias
        titulo="Evidencias"
        moduloOrigen="descripcion"
        moduloId={descripcionId}
      />

    </div>

  );

}
