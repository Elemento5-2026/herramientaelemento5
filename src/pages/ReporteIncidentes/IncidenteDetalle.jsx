import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import InformacionGeneralDetalle from "./Components/InformacionGeneralDetalle";
import ColaboradorDetalle from "./Components/ColaboradorDetalle";
import IncidenteDetalleForm from "./Components/IncidenteDetalleForm";

import "./IncidenteDetalle.css";

import supabase from "../../lib/supabase";

export default function IncidenteDetalle({

  setScreen,
  incidenteId

}) {

  const [incidente,setIncidente]=useState(null);

  const [tiposIncidente,setTiposIncidente]=useState([]);
  const [danos,setDanos]=useState([]);

  useEffect(()=>{

    cargar();

  },[]);

  async function cargar(){

    await Promise.all([

      cargarIncidente(),
      cargarCatalogos()

    ]);

  }

  async function cargarIncidente(){

    const {data,error}=await supabase

      .from("incidentes")

      .select(`
        *,
        catalogo_direcciones(*),
        catalogo_sedes(*)
      `)

      .eq("id",incidenteId)

      .single();

    if(error){

      console.error(error);

      return;

    }

    setIncidente(data);

  }

  async function cargarCatalogos(){

    const [

      tiposRes,
      danosRes

    ]=await Promise.all([

      supabase
        .from("catalogo_tipos_incidente")
        .select("*")
        .eq("activo",true)
        .order("nombre"),

      supabase
        .from("catalogo_danos")
        .select("*")
        .eq("activo",true)
        .order("codigo")

    ]);

    setTiposIncidente(tiposRes.data||[]);
    setDanos(danosRes.data||[]);

  }

  async function guardarCambios(){

    // aquí actualizaremos el incidente

  }

  async function iniciarTF(){

    // aquí crearemos la investigación

  }

  if(!incidente){

    return <>Cargando...</>;

  }

  return(

    <Layout
      header={<Header/>}
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
              onClick={()=>setScreen("reporteIncidentes")}
            >

              ← Volver

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

            <button
              className="btn-primary"
              onClick={iniciarTF}
            >

              📋 Iniciar TF

            </button>

          </div>

        </div>

        <InformacionGeneralDetalle

          incidente={incidente}

        />

        <ColaboradorDetalle

          incidente={incidente}

        />

        <IncidenteDetalleForm

          incidente={incidente}
          setIncidente={setIncidente}

          tiposIncidente={tiposIncidente}
          danos={danos}

        />

      </div>

    </Layout>

  );

}
