import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DataTable from "../../components/DataTable/DataTable";

import supabase from "../../lib/supabase";

import "./Investigaciones.css";

export default function Investigaciones({

  setScreen,
  setInvestigacionSeleccionada

}) {

  const [investigaciones, setInvestigaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function cargarInvestigaciones() {

      setLoading(true);

      const { data, error } = await supabase
        .from("investigaciones")
        .select(`
          *,
          incidentes (
            id,
            codigo,
            fecha,
            catalogo_tipos_incidente (
              nombre
            ),
            catalogo_direcciones (
              nombre
            ),
            catalogo_sedes (
              nombre
            ),
            seccion,
            nombre_colaborador
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {

        console.error("Error al cargar investigaciones:", error);
        setLoading(false);
        return;

      }

      setInvestigaciones(data);
      setLoading(false);

    }

    cargarInvestigaciones();

  }, []);

  // Configuración de columnas para el DataTable
  const columns = [
    {
      key: "codigo_controlado",
      title: "Código",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "160px",
      render: (row) => (
        <button
          className="btn-link"
          onClick={(e) => {
            e.stopPropagation();
            setInvestigacionSeleccionada(row.id);
            setScreen("investigacionDetalle");
          }}
        >
          {row.codigo_controlado}
        </button>
      )
    },
    {
      key: "created_at",
      title: "Fecha",
      type: "date",
      sortable: true,
      searchable: true,
      filterable: true,
      width: "120px"
    },
    {
      key: "tipo",
      title: "Tipo",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => {
        return row.incidentes?.catalogo_tipos_incidente?.nombre || "-";
      }
    },
    {
      key: "direccion",
      title: "Dirección",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => {
        return row.incidentes?.catalogo_direcciones?.nombre || "-";
      }
    },
    {
      key: "area",
      title: "Área",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => {
        return row.incidentes?.seccion || "-";
      }
    },
    {
      key: "estado",
      title: "Estado",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => {
        const estado = row.estado || "Borrador";
        const estadoClass = estado.toLowerCase().replace(/\s+/g, '-');
        return <span className={`estado ${estadoClass}`}>{estado}</span>;
      }
    },
    {
      key: "elaboro",
      title: "Elaboró",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (row) => {
        return row.elaborado_nombre || "-";
      }
    }
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

      <div className="investigaciones">

        <div className="page-header">

          <div>

            <h1>Investigaciones</h1>

            <p>
              Administración de investigaciones de incidentes.
            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
              onClick={() => setScreen("nuevaInvestigacion")}
            >
              ➕ Nueva investigación
            </button>

          </div>

        </div>

        <DataTable
          columns={columns}
          data={investigaciones}
          loading={loading}
          emptyMessage="No hay investigaciones registradas."
          pageSize={10}
          showGlobalSearch={true}
          showPagination={true}
          stickyHeader={true}
          maxHeight="550px"
          onRowClick={(row) => {
            setInvestigacionSeleccionada(row.id);
            setScreen("investigacionDetalle");
          }}
        />

      </div>

    </Layout>

  );

}
