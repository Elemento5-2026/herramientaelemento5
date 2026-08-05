import { useEffect, useState } from "react";

import "./NuevaInvestigacion.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import Encabezado from "./Components/Encabezado";
import Identificacion from "./Components/Identificacion";
import Descripcion from "./Components/Descripcion";
import AccionesInmediatas from "./Components/AccionesInmediatas";
import ArbolCausas from "./Components/ArbolCausas";
import PlanAccion from "./Components/PlanAccion";
import {
  guardarEncabezado,
  actualizarEncabezado,
  guardarIdentificacion,
  guardarDescripcion,
  guardarAccionesInmediatas,
  guardarPlanAccion,
  guardarArbolCausas,
  subirEvidencias,
  obtenerInvestigacionPorId
} from "../../services/investigacionesService";

export default function NuevaInvestigacion({
  setScreen,
  investigacionId
}) {

  const [pasoActual, setPasoActual] = useState(0);

  const [formulario, setFormulario] = useState({

    // Encabezado

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
    aprobado_fecha: "",

    // Identificación

    macroproceso_id: "",
    proceso_id: "",
    clasificacion_incidente_id: "",
    turno_id: "",

    indicador_impactado: "Incidentes",

    // Descripción

    descripcion_incidente: "",
    parte_cuerpo_lesionada_id: "",

    evidencias_descripcion: [],

    // Acciones inmediatas

    acciones_inmediatas: [],

    // Plan de acción
    plan_accion: [],
    evidencias_plan_accion: [],
    arbol_causas: []

  });

  useEffect(() => {
    if (!investigacionId) return;
    cargarInvestigacion();
  }, [investigacionId]);

  async function cargarInvestigacion() {
    try {
      const investigacion = await obtenerInvestigacionPorId(investigacionId);
      console.log(investigacion);
      // Aquí puedes setear el formulario con los datos de la investigación
      // setFormulario({
      //   ...formulario,
      //   participantes: investigacion.participantes,
      //   elaborado_nombre: investigacion.elaborado_nombre,
      //   ...etc
      // });
    } catch (error) {
      console.error(error);
    }
  }

  const guardarTF = async () => {
    try {
      let investigacion;

      if (investigacionId) {
        await actualizarEncabezado({
          id: investigacionId,
          ...formulario
        });
        investigacion = {
          id: investigacionId
        };
      } else {
        investigacion = await guardarEncabezado(formulario);
      }

      await guardarIdentificacion(
        investigacion.id,
        formulario
      );

      const descripcion = await guardarDescripcion(
        investigacion.id,
        formulario
      );

      await subirEvidencias(
        "descripciones",
        descripcion.id,
        formulario.evidencias_descripcion
      );

      const acciones = await guardarAccionesInmediatas(
        investigacion.id,
        formulario.acciones_inmediatas
      );

      for (let i = 0; i < acciones.length; i++) {
        const evidencia = formulario.acciones_inmediatas[i].evidencia;
        if (evidencia) {
          await subirEvidencias(
            "acciones_inmediatas",
            acciones[i].id,
            [evidencia]
          );
        }
      }

      const planAccion = await guardarPlanAccion(
        investigacion.id,
        formulario.plan_accion
      );

      for (let i = 0; i < planAccion.length; i++) {
        const evidencia = formulario.plan_accion[i].evidencia;
        if (evidencia) {
          await subirEvidencias(
            "plan_accion",
            planAccion[i].id,
            [evidencia]
          );
        }
      }

      await guardarArbolCausas(
        investigacion.id,
        formulario.arbol_causas
      );

      alert("Se guardó correctamente.");

    } catch (error) {
      console.error("ERROR COMPLETO:", error);
      alert(
        error.message ||
        JSON.stringify(error)
      );
    }
  };

  const pasos = [
    "Encabezado",
    "Identificación",
    "Descripción",
    "Acciones inmediatas",
    "Análisis de causa",
    "Plan de acción"
  ];

  return (
    <Layout
      header={<Header />}
      sidebar={
        <Sidebar
          screen="investigaciones"
          setScreen={setScreen}
        />
      }
    >
      <div className="nueva-investigacion">
        <div className="page-header">
          <div>
            <button
              className="btn-link"
              onClick={() => setScreen("investigaciones")}
            >
              ← Volver a investigaciones
            </button>
            <h1>{investigacionId ? "Editar investigación" : "Nueva investigación"}</h1>
            <p>
              Complete la información para {investigacionId ? "editar" : "registrar"} la investigación.
            </p>
          </div>
        </div>

        <div className="wizard-layout">
          <aside className="wizard-sidebar">
            {pasos.map((paso, index) => (
              <button
                key={index}
                className={
                  index === pasoActual
                    ? "wizard-item active"
                    : "wizard-item"
                }
                onClick={() => setPasoActual(index)}
              >
                <span className="wizard-number">
                  {index + 1}
                </span>
                <span>
                  {paso}
                </span>
              </button>
            ))}
          </aside>

          <section className="wizard-content">
            <h2>{pasos[pasoActual]}</h2>
            <hr />

            <div style={{ display: pasoActual === 0 ? "block" : "none" }}>
              <Encabezado
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>

            <div style={{ display: pasoActual === 1 ? "block" : "none" }}>
              <Identificacion
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>

            <div style={{ display: pasoActual === 2 ? "block" : "none" }}>
              <Descripcion
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>

            <div style={{ display: pasoActual === 3 ? "block" : "none" }}>
              <AccionesInmediatas
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>

            <div style={{ display: pasoActual === 4 ? "block" : "none" }}>
              <ArbolCausas
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>

            <div style={{ display: pasoActual === 5 ? "block" : "none" }}>
              <PlanAccion
                formulario={formulario}
                setFormulario={setFormulario}
              />
            </div>
          </section>
        </div>

        <div className="wizard-footer">
          <button
            className="btn-secondary"
            disabled={pasoActual === 0}
            onClick={() => setPasoActual(pasoActual - 1)}
          >
            ← Anterior
          </button>

          {pasoActual < pasos.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setPasoActual(pasoActual + 1)}
            >
              Siguiente →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={guardarTF}
            >
              {investigacionId ? "Actualizar TF" : "Guardar TF"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
