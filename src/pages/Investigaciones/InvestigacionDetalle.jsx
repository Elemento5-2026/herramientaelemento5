import { useEffect, useState } from "react";

import "./InvestigacionDetalle.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import {
  obtenerInvestigacionPorId
} from "../../services/investigacionesService";

import EncabezadoDetalle from "./Components/EncabezadoDetalle";
import IdentificacionDetalle from "./Components/IdentificacionDetalle";
import DescripcionDetalle from "./Components/DescripcionDetalle";
import AccionesInmediatasDetalle from "./Components/AccionesInmediatasDetalle";
import ArbolCausasDetalle from "./Components/ArbolCausasDetalle";
import PlanAccionDetalle from "./Components/PlanAccionDetalle";

export default function InvestigacionDetalle({

  setScreen,
  investigacionId

}) {

  const [investigacion, setInvestigacion] = useState(null);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    if (!investigacionId) return;

    cargarInvestigacion();

  }, [investigacionId]);

  async function cargarInvestigacion() {

    try {

      const data =
        await obtenerInvestigacionPorId(
          investigacionId
        );

      setInvestigacion(data);

    } catch (error) {

      console.error(error);

      alert(
        "No fue posible cargar la investigación."
      );

    } finally {

      setCargando(false);

    }

  }

  if (cargando) {

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

          <h2>Cargando investigación...</h2>

        </div>

      </Layout>

    );

  }

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

          <button
            className="btn-link"
            onClick={() =>
              setScreen("investigaciones")
            }
          >
            ← Volver
          </button>

          <h1>

            {investigacion.codigo_controlado}

          </h1>

          <p>

            Estado:
            {" "}
            {investigacion.estado}

          </p>

        </div>

        <EncabezadoDetalle
          investigacion={investigacion}
        />

        <IdentificacionDetalle
          investigacion={investigacion}
        />

        <DescripcionDetalle
          investigacion={investigacion}
        />

        <AccionesInmediatasDetalle
          investigacion={investigacion}
        />

        <ArbolCausasDetalle
          investigacion={investigacion}
        />

        <PlanAccionDetalle
          investigacion={investigacion}
        />

      </div>

    </Layout>

  );

}
