import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import InformacionGeneral from "./Components/InformacionGeneral";
import Colaborador from "./Components/Colaborador";
import Incidente from "./Components/Incidente";
import Evidencias from "./Components/Evidencias";

import "./NuevoReporteIncidente.css";

import supabase from "../../lib/supabase";

export default function NuevoReporteIncidente({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);

  const [formulario, setFormulario] = useState({

    direccion_id:"",
    sede_id:"",

    seccion:"",
    ubicacion:"",

    nombre_colaborador:"",

    fecha:"",
    hora:"",

    tipo_incidente_id:"",
    dano_id:"",

    descripcion:"",

    evidencias:[]

  });

  const [direcciones,setDirecciones]=useState([]);
  const [sedes,setSedes]=useState([]);
  const [tiposIncidente,setTiposIncidente]=useState([]);
  const [danos,setDanos]=useState([]);

  useEffect(()=>{

    async function cargarCatalogos(){

      // aquí cargaremos Supabase

    }

    cargarCatalogos();

  },[]);

  const guardarReporte=async()=>{

    // guardar incidente

  };

  const pasos=[

    "Información General",
    "Colaborador",
    "Incidente",
    "Evidencias"

  ];

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

      <div className="nuevo-reporte-incidente">

        {/* Header */}

        {/* Wizard */}

        {/* Aquí cambiaremos de componente */}

        {pasoActual===0 && (

          <InformacionGeneral

            formulario={formulario}
            setFormulario={setFormulario}

            direcciones={direcciones}
            sedes={sedes}

          />

        )}

        {pasoActual===1 && (

          <Colaborador

            formulario={formulario}
            setFormulario={setFormulario}

          />

        )}

        {pasoActual===2 && (

          <Incidente

            formulario={formulario}
            setFormulario={setFormulario}

            tiposIncidente={tiposIncidente}
            danos={danos}

          />

        )}

        {pasoActual===3 && (

          <Evidencias

            formulario={formulario}
            setFormulario={setFormulario}

          />

        )}

        {/* Footer */}

      </div>

    </Layout>

  );

}
