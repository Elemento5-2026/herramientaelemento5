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

import EstadoSelector from "../../components/EstadoSelector/EstadoSelector";

import {
  guardarEncabezado,
  actualizarEncabezado,
  guardarIdentificacion,
  guardarDescripcion,
  guardarAccionesInmediatas,
  guardarPlanAccion,
  guardarArbolCausas,
  subirEvidencias,
  obtenerInvestigacionPorId,
  actualizarEstado
} from "../../services/investigacionesService";

export default function NuevaInvestigacion({
  setScreen,
  investigacionId,
  mode = 'create' // 'create' | 'edit' | 'view'
}) {

  const [pasoActual, setPasoActual] = useState(0);
  const [investigacionCargada, setInvestigacionCargada] = useState(null);
  const [estadoLocal, setEstadoLocal] = useState('Borrador');

  // ============================================
  // ESTADO DEL FORMULARIO
  // ============================================
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

  // ============================================
  // EFECTO PARA CARGAR INVESTIGACIÓN EXISTENTE
  // ============================================
  useEffect(() => {
    if (mode === 'create') {
      setEstadoLocal('Borrador');
      return;
    }
    if (investigacionId) {
      cargarInvestigacion();
    }
  }, [investigacionId, mode]);

  async function cargarInvestigacion() {
    try {
      const investigacion = await obtenerInvestigacionPorId(investigacionId);
      setInvestigacionCargada(investigacion);
      setEstadoLocal(investigacion.estado || 'Borrador');

      setFormulario({
        codigo_controlado: investigacion.codigo_controlado || "",
        participantes: investigacion.participantes || "",
        elaborado_nombre: investigacion.elaborado_nombre || "",
        elaborado_puesto: investigacion.elaborado_puesto || "",
        elaborado_gerencia: investigacion.elaborado_gerencia || "",
        elaborado_area: investigacion.elaborado_area || "",
        elaborado_fecha: investigacion.elaborado_fecha || "",
        revisado_nombre: investigacion.revisado_nombre || "",
        revisado_puesto: investigacion.revisado_puesto || "",
        revisado_gerencia: investigacion.revisado_gerencia || "",
        revisado_area: investigacion.revisado_area || "",
        revisado_fecha: investigacion.revisado_fecha || "",
        aprobado_nombre: investigacion.aprobado_nombre || "",
        aprobado_puesto: investigacion.aprobado_puesto || "",
        aprobado_gerencia: investigacion.aprobado_gerencia || "",
        aprobado_area: investigacion.aprobado_area || "",
        aprobado_fecha: investigacion.aprobado_fecha || "",
        macroproceso_id: investigacion.macroproceso_id || "",
        proceso_id: investigacion.proceso_id || "",
        clasificacion_incidente_id: investigacion.clasificacion_incidente_id || "",
        turno_id: investigacion.turno_id || "",
        indicador_impactado: investigacion.indicador_impactado || "Incidentes",
        descripcion_incidente: investigacion.descripcion?.descripcion_incidente || "",
        parte_cuerpo_lesionada_id: investigacion.descripcion?.parte_cuerpo_lesionada_id || "",
        evidencias_descripcion: [],
        acciones_inmediatas: investigacion.acciones_inmediatas || [],
        plan_accion: investigacion.plan_accion || [],
        arbol_causas: investigacion.arbol_causas || []
      });

    } catch (error) {
      console.error("Error al cargar investigación:", error);
      alert("Error al cargar la investigación");
    }
  }

  // ============================================
  // MANEJADOR DE CAMBIO DE ESTADO
  // ============================================
  const handleCambioEstado = async (nuevoEstado) => {
    try {
      if (mode === 'create') {
        setEstadoLocal(nuevoEstado);
        return;
      }

      if (!investigacionId) {
        alert('Primero debe guardar la investigación para cambiar el estado');
        return;
      }

      await actualizarEstado(investigacionId, nuevoEstado);
      setEstadoLocal(nuevoEstado);

      if (investigacionCargada) {
        setInvestigacionCargada({
          ...investigacionCargada,
          estado: nuevoEstado
        });
      }

      alert(`Estado actualizado a: ${nuevoEstado}`);

    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado: ' + (error.message || ''));
    }
  };

  // ============================================
  // GUARDAR INVESTIGACIÓN
  // ============================================
  const guardarTF = async () => {
    try {
      let investigacion;

      if (investigacionId) {
        await actualizarEncabezado({
          id: investigacionId,
          ...formulario
        });
        investigacion = { id: investigacionId };
      } else {
        investigacion = await guardarEncabezado(formulario);
      }

      await guardarIdentificacion(investigacion.id, formulario);

      const descripcion = await guardarDescripcion(investigacion.id, formulario);

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

      await guardarArbolCausas(investigacion.id, formulario.arbol_causas);

      alert("Se guardó correctamente.");

      if (mode === 'create') {
        setScreen("investigaciones");
      }

    } catch (error) {
      console.error("ERROR COMPLETO:", error);
      alert(error.message || JSON.stringify(error));
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const pasos = [
    "Encabezado",
    "Identificación",
    "Descripción",
    "Acciones inmediatas",
    "Análisis de causa",
    "Plan de acción"
  ];

  const esVista = mode === 'view';
  const esEdicion = mode === 'edit' || mode === 'create';

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
          <div className="page-header-left">
            <button
              className="btn-link"
              onClick={() => setScreen("investigaciones")}
            >
              ← Volver a investigaciones
            </button>
          </div>

          <div className="page-header-center">
            <h1>
              {mode === 'create' ? 'Nueva investigación' :
               mode === 'view' ? `Ver investigación ${investigacionCargada?.codigo_controlado || ''}` :
               `Editar investigación ${investigacionCargada?.codigo_controlado || ''}`}
            </h1>
            <p>
              {mode === 'create' ? 'Complete la información para registrar la investigación.' :
               mode === 'view' ? 'Visualización de la investigación en modo solo lectura.' :
               'Complete la información para editar la investigación.'}
            </p>
          </div>

          <div className="page-header-right">
            {mode !== 'create' && (
              <EstadoSelector
                estadoActual={estadoLocal || investigacionCargada?.estado || 'Borrador'}
                onChangeEstado={handleCambioEstado}
                readOnly={mode === 'view'}
              />
            )}
          </div>
        </div>

        <div className="wizard-layout">
          <aside className="wizard-sidebar">
            {pasos.map((paso, index) => (
              <button
                key={index}
                className={index === pasoActual ? "wizard-item active" : "wizard-item"}
                onClick={() => setPasoActual(index)}
                disabled={esVista}
              >
                <span className="wizard-number">{index + 1}</span>
                <span>{paso}</span>
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
                readOnly={esVista}
              />
            </div>

            <div style={{ display: pasoActual === 1 ? "block" : "none" }}>
              <Identificacion
                formulario={formulario}
                setFormulario={setFormulario}
                readOnly={esVista}
              />
            </div>

            <div style={{ display: pasoActual === 2 ? "block" : "none" }}>
              <Descripcion
                formulario={formulario}
                setFormulario={setFormulario}
                readOnly={esVista}
              />
            </div>

            <div style={{ display: pasoActual === 3 ? "block" : "none" }}>
              <AccionesInmediatas
                formulario={formulario}
                setFormulario={setFormulario}
                readOnly={esVista}
              />
            </div>

            <div style={{ display: pasoActual === 4 ? "block" : "none" }}>
              <ArbolCausas
                formulario={formulario}
                setFormulario={setFormulario}
                readOnly={esVista}
              />
            </div>

            <div style={{ display: pasoActual === 5 ? "block" : "none" }}>
              <PlanAccion
                formulario={formulario}
                setFormulario={setFormulario}
                readOnly={esVista}
              />
            </div>
          </section>
        </div>

        <div className="wizard-footer">
          <button
            className="btn-secondary"
            disabled={pasoActual === 0 || esVista}
            onClick={() => setPasoActual(pasoActual - 1)}
          >
            ← Anterior
          </button>

          {pasoActual < pasos.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setPasoActual(pasoActual + 1)}
              disabled={esVista}
            >
              Siguiente →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={guardarTF}
              disabled={esVista}
            >
              {mode === 'create' ? 'Guardar TF' : 'Actualizar TF'}
            </button>
          )}
        </div>

      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E5E7EB;
          flex-wrap: wrap;
          gap: 12px;
        }

        .page-header-left {
          flex: 1;
        }

        .page-header-center {
          flex: 2;
          text-align: center;
        }

        .page-header-center h1 {
          margin: 0;
          color: #1F2937;
          font-size: 24px;
        }

        .page-header-center p {
          margin: 4px 0 0 0;
          color: #6B7280;
          font-size: 14px;
        }

        .page-header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .page-header-left {
            text-align: left;
          }

          .page-header-right {
            justify-content: center;
          }

          .page-header-center h1 {
            font-size: 20px;
          }
        }
      `}</style>

    </Layout>
  );
}
