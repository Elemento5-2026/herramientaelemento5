import { useEffect, useState } from "react";
import "./Encabezado.css";

import { guardarEncabezado } from "../../../services/investigacionesService";
import { obtenerCatalogo } from "../../../services/catalogosService";

import Firma from "./Firma";

export default function Encabezado() {

  const [gerencias, setGerencias] = useState([]);

  const [formulario, setFormulario] = useState({

    codigo_controlado: "",

    participantes: "",

    elaborado_nombre: "",
    elaborado_puesto: "",
    elaborado_gerencia: "",
    elaborado_area: "",
    elaborado_fecha: "",

    revisado_nombre: "",
    revisado_puesto: "",
    revisado_gerencia: "",
    revisado_area: "",
    revisado_fecha: "",

    aprobado_nombre: "",
    aprobado_puesto: "",
    aprobado_gerencia: "",
    aprobado_area: "",
    aprobado_fecha: ""

  });

  useEffect(() => {
    cargarGerencias();
  }, []);

  const cargarGerencias = async () => {

    try {

      const data = await obtenerCatalogo("catalogo_gerencias");

      setGerencias(data);

    } catch (error) {

      console.error(error);

      alert("Error al cargar las gerencias.");

    }

  };

  const guardar = async () => {

    try {

      const data = await guardarEncabezado(formulario);

      console.log(data);

      alert("Encabezado guardado correctamente.");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });

  };

  const firmas = [
    {
      titulo: "Elaboró",
      prefijo: "elaborado"
    },
    {
      titulo: "Revisó",
      prefijo: "revisado"
    },
    {
      titulo: "Aprobó",
      prefijo: "aprobado"
    }
  ];

  return (

    <div className="encabezado">

      <div className="form-group">

        <label>Código controlado del Tratamiento de Falla por Incidente</label>

        <input
          type="text"
          name="codigo_controlado"
          value={formulario.codigo_controlado}
          onChange={handleChange}
          placeholder="Lo asigna Excelencia Operativa"
        />

      </div>

      <div className="form-group">

        <label>Participantes</label>

        <div className="catalogo-placeholder">
          Aquí irá el selector múltiple de participantes.
        </div>

      </div>

      {firmas.map((firma) => (

        <Firma
          key={firma.prefijo}
          titulo={firma.titulo}
          prefijo={firma.prefijo}
          formulario={formulario}
          gerencias={gerencias}
          handleChange={handleChange}
        />

      ))}

      <div style={{ marginTop: "30px" }}>

        <button
          className="btn-primary"
          onClick={guardar}
        >
          💾 Guardar encabezado
        </button>

      </div>

    </div>

  );

}
