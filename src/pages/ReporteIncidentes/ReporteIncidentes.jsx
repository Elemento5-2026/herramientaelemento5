import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DataTable from "../../components/DataTable/DataTable";

import "./ReporteIncidentes.css";

import supabase from "../../lib/supabase";
import {
  crearInvestigacionDesdeIncidente
} from "../../services/investigacionesService";

export default function ReporteIncidentes({

  setScreen,
  setIncidenteSeleccionado,
  setInvestigacionSeleccionada,
  setInvestigacionModo,
  navegarAInvestigacion,
  navegarADetalleInvestigacion

}) {

  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    cargarIncidentes();

  }, []);

  async function cargarIncidentes() {

    setLoading(true);

    const { data, error } = await supabase

      .from("incidentes")

      .select(`
        *,
        catalogo_direcciones(nombre),
        catalogo_sedes(nombre),
        catalogo_tipos_incidente(nombre),
        catalogo_danos(codigo)
      `)

      .order("created_at", {

        ascending: false

      });

    if (error) {

      console.error(error);
      setLoading(false);
      return;

    }

    setIncidentes(data);
    setLoading(false);

  }

  // ============================================
  // Manejador para Iniciar TF
  // ============================================
  async function handleIniciarTF(incidente) {

    if (!incidente.tipo_incidente_id) {

      alert(
        "Debe clasificar el incidente antes de iniciar el TF."
      );

      return;

    }

    try {

      const investigacion =
        await crearInvestigacionDesdeIncidente(
          incidente
        );

      navegarAInvestigacion(investigacion.id, 'edit');

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "No fue posible iniciar el TF."
      );

    }

  }

  // ============================================
  // Manejador para Abrir TF
  // ============================================
  const handleAbrirTF = (investigacionId, estado) => {
    // Si está Aprobado o Cerrado, abrir detalle (solo lectura con PDF)
    if (estado === 'Aprobado' || estado === 'Cerrado') {
      navegarADetalleInvestigacion(investigacionId);
    } else {
      // Si está Borrador o En revisión, abrir en modo edición
      navegarAInvestigacion(investigacionId, 'edit');
    }
  };

  // Configuración de columnas para el DataTable
  const columns = [
    {
      key: "codigo",
      title: "Código",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "120px",
      render: (row) => (
        <button
          className="btn-link"
          onClick={(e) => {
            e.stopPropagation();
            setIncidenteSeleccionado(row.id);
            setScreen("incidenteDetalle");
          }}
        >
          {row.codigo}
        </button>
      )
    },
    {
      key: "fecha",
      title: "Fecha",
      type: "date",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "110px"
    },
    {
      key: "hora",
      title: "Hora",
      sortable: true,
      searchable: false,
      filterable: true,
      width: "80px",
      render: (row) => row.hora?.substring(0, 5) || ""
    },
    {
      key: "direccion",
      title: "Dirección",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => row.catalogo_direcciones?.nombre || ""
    },
    {
      key: "sede",
      title: "Sede",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => row.catalogo_sedes?.nombre || ""
    },
    {
      key: "seccion",
      title: "Sección",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "120px"
    },
    {
      key: "colaborador",
      title: "Colaborador",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => row.nombre_colaborador || ""
    },
    {
      key: "clasificacion",
      title: "Clasificación",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => row.catalogo_tipos_incidente?.nombre || "Pendiente"
    },
    {
      key: "dano",
      title: "Daño",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "100px",
      render: (row) => row.catalogo_danos?.codigo || "Pendiente"
    },
    {
      key: "investigacion",
      title: "Investigación",
      sortable: false,
      searchable: false,
      filterable: true,
      width: "130px",
      render: (row) => (
        row.investigacion_id ? (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              handleAbrirTF(row.investigacion_id, row.estado || 'edit');
            }}
          >
            📂 Abrir TF
          </button>
        ) : (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              handleIniciarTF(row);
            }}
          >
            📋 Iniciar TF
          </button>
        )
      )
    }
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

      <div className="reporte-incidentes">

        <div className="page-header">

          <div>

            <h1>

              Reporte de Incidentes

            </h1>

            <p>

              Administración de incidentes reportados por SISO.

            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
              onClick={() =>
                setScreen("nuevoReporteIncidente")
              }
            >

              ➕ Reportar incidente

            </button>

          </div>

        </div>

        <div className="data-table-section">
          <DataTable
            columns={columns}
            data={incidentes}
            loading={loading}
            emptyMessage="No hay incidentes registrados."
            pageSize={10}
            showGlobalSearch={true}
            showPagination={true}
          />
        </div>

      </div>

    </Layout>

  );

}
