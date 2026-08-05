import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import InformacionGeneralDetalle from "./Components/InformacionGeneralDetalle";
import ColaboradorDetalle from "./Components/ColaboradorDetalle";
import DatosIncidente from "./Components/DatosIncidente";

import "./IncidenteDetalle.css";

import supabase from "../../lib/supabase";

export default function IncidenteDetalle({

  setScreen,
  incidenteId

}) {

  const [incidente, setIncidente] = useState(null);

  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [danos, setDanos] = useState([]);

  useEffect(() => {

    cargar();

  }, []);

  async function cargar() {

    await Promise.all([

      cargarIncidente(),
      cargarCatalogos()

    ]);

  }

  async function cargarIncidente() {

    const { data, error } = await supabase

      .from("incidentes")

      .select(`
        *,
        catalogo_direcciones(*),
        catalogo_sedes(*)
      `)

      .eq("id", incidenteId)

      .single();

    if (error) {

      console.error(error);

      return;

    }

    setIncidente(data);

  }

  async function cargarCatalogos() {

    const [

      tiposRes,
      danosRes

    ] = await Promise.all([

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

    setTiposIncidente(tiposRes.data || []);
    setDanos(danosRes.data || []);

  }

  async function guardarCambios() {

    const { error } = await supabase

      .from("incidentes")

      .update({

        tipo_incidente_id: incidente.tipo_incidente_id || null,

        dano_id: incidente.dano_id || null,

        descripcion: incidente.descripcion

      })

      .eq("id", incidente.id);

    if (error) {

      console.error(error);

      alert("Error al guardar los cambios.");

      return;

    }

    alert("Incidente actualizado correctamente.");

  }

  if (!incidente) {

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

        <div className="incidente-detalle">

          Cargando incidente...

        </div>

      </Layout>

    );

  }

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

      <div className="incidente-detalle">

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() => setScreen("reporteIncidentes")}
            >

              ← Volver a Reporte de Incidentes

            </button>

            <h1>

              {incidente.codigo}

            </h1>

            <p>

              Estado:
              <strong> {incidente.estado}</strong>

            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
              onClick={guardarCambios}
            >

              💾 Guardar Cambios

            </button>

          </div>

        </div>

        <InformacionGeneralDetalle

          incidente={incidente}

        />

        <ColaboradorDetalle

          incidente={incidente}

        />

        <DatosIncidente

          incidente={incidente}
          setIncidente={setIncidente}

          tiposIncidente={tiposIncidente}
          danos={danos}

        />

      </div>

    </Layout>

  );

}
