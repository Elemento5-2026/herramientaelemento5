// InvestigacionDetalle.jsx
import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import supabase from "../../lib/supabase";

import "./InvestigacionDetalle.css";

export default function InvestigacionDetalle({

  setScreen,
  investigacionId

}) {

  const [investigacion, setInvestigacion] = useState(null);

  useEffect(() => {

    async function cargarInvestigacion() {

      const { data, error } = await supabase
        .from("investigaciones")
        .select("*")
        .eq("id", investigacionId)
        .single();

      if (error) {

        console.error(error);
        return;

      }

      setInvestigacion(data);

    }

    if (investigacionId) {

      cargarInvestigacion();

    }

  }, [investigacionId]);

  const getEstadoColor = (estado) => {
    if (!estado) return "#6b7280";
    
    const colores = {
      "En Progreso": "#f59e0b",
      "Completado": "#10b981",
      "Pendiente": "#6b7280",
      "En Revisión": "#3b82f6",
      "Abierta": "#3b82f6",
      "Cerrada": "#10b981",
      "En investigación": "#f59e0b"
    };
    return colores[estado] || "#6b7280";
  };

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

      <div className="investigacion-detalle">

        {/* Header con acciones */}
        <div className="detalle-header">
          <div className="header-izquierda">
            <button
              className="btn-volver"
              onClick={() => setScreen("investigaciones")}
            >
              ← Volver a investigaciones
            </button>
            <div className="header-titulo">
              <h1>
                {investigacion ? investigacion.codigo_controlado : "Investigación"}
              </h1>
              {investigacion && investigacion.estado && (
                <span 
                  className="estado-badge"
                  style={{ backgroundColor: getEstadoColor(investigacion.estado) }}
                >
                  {investigacion.estado}
                </span>
              )}
            </div>
          </div>
          <div className="header-acciones">
            <button className="btn-editar">✎ Editar</button>
            <button className="btn-imprimir">🖨 Imprimir</button>
          </div>
        </div>

        {!investigacion ? (

          <div className="cargando-container">
            <div className="cargando-spinner"></div>
            <p>Cargando información de la investigación...</p>
          </div>

        ) : (

          <div className="detalle-contenido">

            {/* Sección 1: Información General */}
            <section className="seccion">
              <h2 className="seccion-titulo">Información General</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Código</span>
                  <span className="info-valor">{investigacion.codigo_controlado || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estado</span>
                  <span 
                    className="info-valor estado-texto"
                    style={{ color: getEstadoColor(investigacion.estado) }}
                  >
                    {investigacion.estado || "No especificado"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fecha de Elaboración</span>
                  <span className="info-valor">{investigacion.elaborado_fecha || "No especificada"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID Interno</span>
                  <span className="info-valor">{investigacion.id || "No especificado"}</span>
                </div>
              </div>
            </section>

            {/* Sección 2: Equipo Investigador */}
            <section className="seccion">
              <h2 className="seccion-titulo">Equipo Investigador</h2>
              <div className="tabla-container">
                <table className="tabla-moderna">
                  <thead>
                    <tr>
                      <th>Rol</th>
                      <th>Nombre</th>
                      <th>Área</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="rol-badge elaboro">Elaboró</span></td>
                      <td>{investigacion.elaborado_nombre || "No especificado"}</td>
                      <td>{investigacion.elaborado_area || "No especificada"}</td>
                    </tr>
                    <tr>
                      <td><span className="rol-badge reviso">Revisó</span></td>
                      <td>{investigacion.revisado_nombre || "No especificado"}</td>
                      <td>{investigacion.revisado_area || "No especificada"}</td>
                    </tr>
                    <tr>
                      <td><span className="rol-badge aprobo">Aprobó</span></td>
                      <td>{investigacion.aprobado_nombre || "No especificado"}</td>
                      <td>{investigacion.aprobado_area || "No especificada"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección 3: Identificación */}
            <section className="seccion">
              <h2 className="seccion-titulo">Identificación</h2>
              <div className="identificacion-grid">
                <div className="identificacion-item">
                  <span className="id-label">Dirección</span>
                  <span className="id-valor">{investigacion.direccion || "No especificada"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Gerencia</span>
                  <span className="id-valor">{investigacion.gerencia || "No especificada"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Macroproceso</span>
                  <span className="id-valor">{investigacion.macroproceso || "No especificado"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Proceso</span>
                  <span className="id-valor">{investigacion.proceso || "No especificado"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Área</span>
                  <span className="id-valor">{investigacion.area || "No especificada"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Turno</span>
                  <span className="id-valor">{investigacion.turno || "No especificado"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Tipo de Incidente</span>
                  <span className="id-valor">{investigacion.tipo_incidente || "No especificado"}</span>
                </div>
                <div className="identificacion-item">
                  <span className="id-label">Indicador Impactado</span>
                  <span className="id-valor">{investigacion.indicador_impactado || "No especificado"}</span>
                </div>
              </div>
            </section>

            {/* Sección 4: Descripción del Incidente */}
            <section className="seccion">
              <h2 className="seccion-titulo">Descripción del Incidente</h2>
              <div className="descripcion-contenedor">
                <div className="descripcion-texto">
                  <p>{investigacion.descripcion || "No se ha registrado una descripción del incidente."}</p>
                </div>
                <div className="galeria-container">
                  <h3 className="galeria-titulo">Galería de Fotografías</h3>
                  <div className="galeria-placeholder">
                    <div className="galeria-mensaje">
                      <span className="icono-galeria">📸</span>
                      <p>Las imágenes se cargarán en la siguiente fase</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 5: Acciones Inmediatas */}
            <section className="seccion">
              <h2 className="seccion-titulo">Acciones Inmediatas</h2>
              <div className="tabla-container">
                <table className="tabla-moderna">
                  <thead>
                    <tr>
                      <th>Acción Realizada</th>
                      <th>Responsable</th>
                      <th>Tiempo de Respuesta</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="mensaje-vacio">
                        <span className="icono-info">ℹ️</span>
                        <span>Las acciones inmediatas se cargarán en la siguiente fase</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección 6: Árbol de Causas */}
            <section className="seccion">
              <h2 className="seccion-titulo">Árbol de Causas</h2>
              <div className="arbol-placeholder">
                <div className="arbol-mensaje">
                  <span className="icono-arbol">🧩</span>
                  <p>El árbol de causas se visualizará aquí con React Flow en la siguiente fase</p>
                  <span className="arbol-submensaje">Componente integrado con React Flow</span>
                </div>
              </div>
            </section>

            {/* Sección 7: Plan de Acción */}
            <section className="seccion">
              <h2 className="seccion-titulo">Plan de Acción</h2>
              <div className="tabla-container">
                <table className="tabla-moderna">
                  <thead>
                    <tr>
                      <th>Acción</th>
                      <th>Responsable</th>
                      <th>Fecha Compromiso</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="mensaje-vacio">
                        <span className="icono-info">ℹ️</span>
                        <span>El plan de acción se cargará en la siguiente fase</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>

        )}

      </div>

    </Layout>

  );

}
