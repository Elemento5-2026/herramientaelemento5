import { useEffect, useState } from "react";
import "./Encabezado.css";

import { obtenerCatalogo } from "../../../services/catalogosService";

import Firma from "./Firma";

export default function Encabezado({

  formulario,
  setFormulario

}) {

  const [gerencias, setGerencias] = useState([]);

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

        <textarea
          name="participantes"
          value={formulario.participantes}
          onChange={handleChange}
          rows={3}
        />

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

    </div>

  );

}
