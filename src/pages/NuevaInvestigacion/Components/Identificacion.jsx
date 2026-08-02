import { useEffect, useState } from "react";
import "./Identificacion.css";

import { obtenerCatalogo } from "../../../services/catalogosService";
import { guardarIdentificacion } from "../../../services/investigacionesService";

import BotonGuardar from "../../../components/Form/BotonGuardar";

export default function Identificacion({ investigacionId }) {

  const [macroprocesos, setMacroprocesos] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [impactos, setImpactos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [formulario, setFormulario] = useState({

    macroproceso_id: "",
    proceso_id: "",
    clasificacion_incidente_id: "",
    turno_id: "",

    indicador_impactado: "Incidentes"

  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {

    try {

      const [
        dataMacroprocesos,
        dataProcesos,
        dataImpactos,
        dataTurnos
      ] = await Promise.all([

        obtenerCatalogo("catalogo_macroprocesos"),
        obtenerCatalogo("catalogo_procesos"),
        obtenerCatalogo("catalogo_tipos_incidente"),
        obtenerCatalogo("catalogo_turnos")

      ]);

      setMacroprocesos(dataMacroprocesos);
      setProcesos(dataProcesos);
      setImpactos(dataImpactos);
      setTurnos(dataTurnos);

    } catch (error) {

      console.error(error);

      alert("Error al cargar los catálogos.");

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

      await guardarIdentificacion(
        investigacionId,
        formulario
      );

      alert("Identificación guardada correctamente.");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  };

  return (

    <div className="identificacion">

      <div className="form-row">

        <label>Norma aplicable</label>

        <input
          type="text"
          value="ISO 45001"
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Procedencia</label>

        <input
          type="text"
          value="Seguridad Industrial"
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Macroproceso</label>

        <select
          name="macroproceso_id"
          value={formulario.macroproceso_id}
          onChange={handleChange}
        >

          <option value="">Seleccione...</option>

          {macroprocesos.map((item) => (

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

        <label>Proceso</label>

        <select
          name="proceso_id"
          value={formulario.proceso_id}
          onChange={handleChange}
        >

          <option value="">Seleccione...</option>

          {procesos.map((item) => (

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

        <label>Nombre del indicador impactado</label>

        <input
          type="text"
          value={formulario.indicador_impactado}
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Impacto</label>

        <select
          name="clasificacion_incidente_id"
          value={formulario.clasificacion_incidente_id}
          onChange={handleChange}
        >

          <option value="">Seleccione...</option>

          {impactos.map((item) => (

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

        <label>Turno</label>

        <select
          name="turno_id"
          value={formulario.turno_id}
          onChange={handleChange}
        >

          <option value="">Seleccione...</option>

          {turnos.map((item) => (

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
        texto="Guardar identificación"
        onClick={guardar}
      />

    </div>

  );

}
