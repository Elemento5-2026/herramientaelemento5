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
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {

    async function cargarInvestigaciones() {

      setLoading(true);
      setErrorMsg(null);

      // PRIMERO: Verificar si hay datos en la tabla investigaciones
      console.log("🔍 1. Consultando tabla investigaciones...");
      
      const { data: todas, error: errorTodas } = await supabase
        .from("investigaciones")
        .select("*");

      if (errorTodas) {
        console.error("❌ Error al consultar investigaciones:", errorTodas);
        setErrorMsg("Error al cargar datos: " + errorTodas.message);
        setLoading(false);
        return;
      }

      console.log("📊 2. Total de investigaciones en la tabla:", todas?.length || 0);
      console.log("📊 3. Primeras 3 investigaciones:", todas?.slice(0, 3));

      if (!todas || todas.length === 0) {
        console.log("⚠️ No hay investigaciones en la tabla");
        setInvestigaciones([]);
        setLoading(false);
        return;
      }

      // AHORA: Hacer el JOIN con incidentes
      console.log("🔍 4. Haciendo JOIN con incidentes...");
      
      const { data, error } = await supabase
        .from("investigaciones")
        .select(`
          *,
          incidentes!investigaciones_incidente_id_fkey (
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
        console.error("❌ Error en el JOIN:", error);
        setErrorMsg("Error en la consulta: " + error.message);
        setLoading(false);
        return;
      }

      console.log("📊 5. Datos con JOIN:", data);
      console.log("📊 6. Total con JOIN:", data?.length || 0);
      
      // Verificar si cada investigación tiene incidente
      if (data && data.length > 0) {
        data.forEach((inv, index) => {
          console.log(`📊 7. Investigación ${index + 1}:`, {
            id: inv.id,
            codigo: inv.codigo_controlado,
            tiene_incidente: !!inv.incidentes,
            incidente_id: inv.incidente_id,
            incidente_data: inv.incidentes
          });
        });
      }

      setInvestigaciones(data || []);
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
        return row.incidentes?.seccion || row.incidentes?.catalogo_sedes?.nombre || "-";
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

  // Mostrar error si existe
  if (errorMsg) {
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
              <p>Administración de investigaciones de incidentes.</p>
            </div>
          </div>
          <div className="error-container">
            <p>❌ {errorMsg}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
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
