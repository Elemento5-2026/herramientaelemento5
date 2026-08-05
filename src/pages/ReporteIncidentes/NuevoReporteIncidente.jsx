import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import InformacionGeneral from "./Components/InformacionGeneral";
import Colaborador from "./Components/Colaborador";
import Incidente from "./Components/Incidente";

import "./NuevoReporteIncidente.css";

import supabase from "../../lib/supabase";

export default function NuevoReporteIncidente({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);

  const [formulario, setFormulario] = useState({

    direccion_id: "",
    sede_id: "",

    seccion: "",
    ubicacion: "",

    nombre_colaborador: "",

    fecha: "",
    hora: "",

    tipo_incidente_id: "",
    dano_id: "",

    descripcion: ""

  });

  const [direcciones, setDirecciones] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [danos, setDanos] = useState([]);

  useEffect(() => {

    cargarCatalogos();

  }, []);

  async function cargarCatalogos() {

    const [

      direccionesRes,
      sedesRes,
      tiposRes,
      danosRes

    ] = await Promise.all([

      supabase
        .from("catalogo_direcciones")
        .select("*")
        .eq("activo", true)
        .order("nombre"),

      supabase
        .from("catalogo_sedes")
        .select("*")
        .eq("activo", true)
        .order("nombre"),

      supabase
        .from("catalogo_tipos_incidente")
        .select("*")
        .eq("activo", true)
        .order("nombre"),

      supabase
        .from("catalogo_danos")
        .select("*")
        .eq("activo", true)
        .order("codigo")

    ]);

    console.log("========== DIRECCIONES ==========");
    console.log(direccionesRes);

    console.log("========== SEDES ==========");
    console.log(sedesRes);

    console.log("========== TIPOS ==========");
    console.log(tiposRes);

    console.log("========== DAÑOS ==========");
    console.log(danosRes);

    setDirecciones(direccionesRes.data || []);
    setSedes(sedesRes.data || []);
    setTiposIncidente(tiposRes.data || []);
    setDanos(danosRes.data || []);

  }

  async function guardarReporte() {

    console.log(formulario);

  }

  const pasos = [

    "Información General",
    "Colaborador",
    "Incidente"

  ];

  return (

    <Layout
      header={<Header />}
      sidebar={
        <Sidebar
          screen="reporteIncidentes"
          setScreen={setScreen}
        />
      }
    >

      <div className="nuevo-reporte-incidente">

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() => setScreen("reporteIncidentes")}
            >
              ← Volver a Reporte de Incidentes
            </button>

            <h1>

              Reportar Incidente

            </h1>

            <p>

              Complete la información para registrar un nuevo incidente.

            </p>

          </div>

        </div>

        <div className="wizard-layout">

          <aside className="wizard-sidebar">

            {pasos.map((paso, index) => (

              <button
                key={index}
                className={
                  pasoActual === index
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

            {pasoActual === 0 && (

              <InformacionGeneral
                formulario={formulario}
                setFormulario={setFormulario}
                direcciones={direcciones}
                sedes={sedes}
              />

            )}

            {pasoActual === 1 && (

              <Colaborador
                formulario={formulario}
                setFormulario={setFormulario}
              />

            )}

            {pasoActual === 2 && (

              <Incidente
                formulario={formulario}
                setFormulario={setFormulario}
                tiposIncidente={tiposIncidente}
                danos={danos}
              />

            )}

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
              onClick={guardarReporte}
            >

              Guardar Reporte

            </button>

          )}

        </div>

      </div>

    </Layout>

  );

}
