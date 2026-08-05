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

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() =>
                setScreen("investigaciones")
              }
            >
              ← Volver a investigaciones
            </button>

            <h1>

              Investigación

            </h1>

            <p>

              Visualización de la investigación.

            </p>

          </div>

        </div>

        {!investigacion ? (

          <p>

            Cargando...

          </p>

        ) : (

          <div className="detalle-card">

            <h2>

              {investigacion.codigo_controlado}

            </h2>

            <hr />

            <p>

              <strong>ID:</strong>{" "}
              {investigacion.id}

            </p>

            <p>

              <strong>Estado:</strong>{" "}
              {investigacion.estado}

            </p>

            <p>

              <strong>Elaboró:</strong>{" "}
              {investigacion.elaborado_nombre}

            </p>

            <p>

              <strong>Área:</strong>{" "}
              {investigacion.elaborado_area}

            </p>

            <p>

              <strong>Fecha:</strong>{" "}
              {investigacion.elaborado_fecha}

            </p>

          </div>

        )}

      </div>

    </Layout>

  );

}
