import { useEffect, useState } from "react";
import "./Dashboard.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import supabase from "../../lib/supabase";

export default function Dashboard({ setScreen }) {

  // ============================================
  // ESTADOS
  // ============================================
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    SPT: 0,
    CPT: 0,
    PA: 0,
    CMD: 0,
    totalIncidentes: 0
  });
  const [incidentesPorMes, setIncidentesPorMes] = useState([]);
  const [estadosInvestigacion, setEstadosInvestigacion] = useState({
    Borrador: 0,
    'En revisión': 0,
    Aprobado: 0,
    Cerrado: 0
  });
  const [accionesData, setAccionesData] = useState([]);
  const [resumenAcciones, setResumenAcciones] = useState({
    abiertas: 0,
    vencidas: 0,
    finalizadas: 0
  });

  // ============================================
  // CARGAR DATOS
  // ============================================
  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    setLoading(true);
    try {
      await Promise.all([
        cargarKPIs(),
        cargarIncidentesPorMes(),
        cargarEstadosInvestigacion(),
        cargarAcciones()
      ]);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // 1. KPIs - Incidentes por tipo
  // ============================================
  async function cargarKPIs() {
    // Obtener incidentes del mes actual
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const primerDiaStr = primerDia.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("incidentes")
      .select(`
        id,
        catalogo_tipos_incidente (
          nombre
        )
      `)
      .gte("fecha", primerDiaStr);

    if (error) {
      console.error("Error al cargar KPIs:", error);
      return;
    }

    // Contar por tipo
    const conteo = {
      SPT: 0,
      CPT: 0,
      PA: 0,
      CMD: 0,
      total: data?.length || 0
    };

    data?.forEach(incidente => {
      const tipo = incidente.catalogo_tipos_incidente?.nombre;
      if (tipo && conteo.hasOwnProperty(tipo)) {
        conteo[tipo] = (conteo[tipo] || 0) + 1;
      }
    });

    setKpis({
      SPT: conteo.SPT || 0,
      CPT: conteo.CPT || 0,
      PA: conteo.PA || 0,
      CMD: conteo.CMD || 0,
      totalIncidentes: conteo.total || 0
    });
  }

  // ============================================
  // 2. Incidentes por mes (últimos 6 meses)
  // ============================================
  async function cargarIncidentesPorMes() {
    const hoy = new Date();
    const meses = [];
    
    // Obtener últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.toLocaleString('es', { month: 'short' });
      const año = fecha.getFullYear();
      const key = `${año}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      // Primer día del mes
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const primerDiaStr = primerDia.toISOString().split('T')[0];
      
      // Último día del mes
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      const ultimoDiaStr = ultimoDia.toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from("incidentes")
        .select("*", { count: 'exact', head: true })
        .gte("fecha", primerDiaStr)
        .lte("fecha", ultimoDiaStr);

      if (error) {
        console.error("Error al cargar incidentes por mes:", error);
        return;
      }

      meses.push({
        mes: `${mes} ${año}`,
        key: key,
        cantidad: count || 0
      });
    }

    setIncidentesPorMes(meses);
  }

  // ============================================
  // 3. Estados de investigaciones
  // ============================================
  async function cargarEstadosInvestigacion() {
    const { data, error } = await supabase
      .from("investigaciones")
      .select("estado");

    if (error) {
      console.error("Error al cargar estados de investigaciones:", error);
      return;
    }

    const conteo = {
      Borrador: 0,
      'En revisión': 0,
      Aprobado: 0,
      Cerrado: 0
    };

    data?.forEach(inv => {
      const estado = inv.estado || 'Borrador';
      if (conteo.hasOwnProperty(estado)) {
        conteo[estado] = (conteo[estado] || 0) + 1;
      }
    });

    setEstadosInvestigacion(conteo);
  }

  // ============================================
  // 4. Acciones del plan de acción
  // ============================================
  async function cargarAcciones() {
    // Obtener todas las acciones del plan de acción
    const { data, error } = await supabase
      .from("investigaciones_plan_accion")
      .select(`
        *,
        investigaciones (
          id,
          codigo_controlado
        )
      `);

    if (error) {
      console.error("Error al cargar acciones:", error);
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let abiertas = 0;
    let vencidas = 0;
    let finalizadas = 0;

    // Procesar acciones
    const accionesPorResponsable = {};

    data?.forEach(accion => {
      const responsable = accion.responsable || 'Sin asignar';
      const fechaInicio = accion.fecha_inicio ? new Date(accion.fecha_inicio) : null;
      const fechaPropuesta = accion.fecha_propuesta ? new Date(accion.fecha_propuesta) : null;
      const fechaFin = accion.fecha_fin ? new Date(accion.fecha_fin) : null;

      // Inicializar contador del responsable
      if (!accionesPorResponsable[responsable]) {
        accionesPorResponsable[responsable] = {
          abiertas: 0,
          vencidas: 0,
          finalizadas: 0
        };
      }

      // Clasificar acción
      if (fechaFin) {
        // Finalizada
        finalizadas++;
        accionesPorResponsable[responsable].finalizadas++;
      } else if (fechaInicio && fechaPropuesta) {
        // En proceso - verificar si está vencida
        if (hoy > fechaPropuesta) {
          vencidas++;
          accionesPorResponsable[responsable].vencidas++;
        } else {
          abiertas++;
          accionesPorResponsable[responsable].abiertas++;
        }
      } else if (fechaInicio && !fechaPropuesta) {
        // En proceso sin fecha propuesta
        abiertas++;
        accionesPorResponsable[responsable].abiertas++;
      } else {
        // Pendiente (sin fecha inicio)
        abiertas++;
        accionesPorResponsable[responsable].abiertas++;
      }
    });

    // Convertir a array y ordenar por acciones abiertas (mayor a menor)
    const accionesArray = Object.keys(accionesPorResponsable).map(responsable => ({
      responsable,
      abiertas: accionesPorResponsable[responsable].abiertas || 0,
      vencidas: accionesPorResponsable[responsable].vencidas || 0,
      finalizadas: accionesPorResponsable[responsable].finalizadas || 0,
      total: (accionesPorResponsable[responsable].abiertas || 0) + 
             (accionesPorResponsable[responsable].vencidas || 0) + 
             (accionesPorResponsable[responsable].finalizadas || 0)
    }));

    accionesArray.sort((a, b) => b.abiertas - a.abiertas);

    setResumenAcciones({ abiertas, vencidas, finalizadas });
    setAccionesData(accionesArray);
  }

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <Layout
        header={<Header />}
        sidebar={
          <Sidebar
            screen="dashboard"
            setScreen={setScreen}
          />
        }
      >
        <div className="dashboard">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Cargando datos...</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      header={<Header />}
      sidebar={
        <Sidebar
          screen="dashboard"
          setScreen={setScreen}
        />
      }
    >
      <div className="dashboard">

        {/* ============================================
            HEADER
        ============================================ */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Resumen ejecutivo del Sistema de Gestión de Incidentes
            </p>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('es-GT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* ============================================
            FILA 1: KPIs
        ============================================ */}
        <div className="dashboard-kpis">
          <StatCard
            title="SPT"
            value={kpis.SPT}
            subtitle="Este mes"
            icon="🔧"
            color="#3B82F6"
            onClick={() => console.log('Filtrar por SPT')}
          />
          <StatCard
            title="CPT"
            value={kpis.CPT}
            subtitle="Este mes"
            icon="🛠️"
            color="#10B981"
            onClick={() => console.log('Filtrar por CPT')}
          />
          <StatCard
            title="PA"
            value={kpis.PA}
            subtitle="Este mes"
            icon="⚡"
            color="#F59E0B"
            onClick={() => console.log('Filtrar por PA')}
          />
          <StatCard
            title="CMD"
            value={kpis.CMD}
            subtitle="Este mes"
            icon="📋"
            color="#EF4444"
            onClick={() => console.log('Filtrar por CMD')}
          />
        </div>

        {/* ============================================
            FILA 2: Gráfico de barras - Incidentes por mes
        ============================================ */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>📊 Incidentes por mes</h3>
            <span className="dashboard-card-badge">Últimos 6 meses</span>
          </div>
          <div className="dashboard-chart">
            {incidentesPorMes.map((item, index) => {
              const max = Math.max(...incidentesPorMes.map(i => i.cantidad), 1);
              const height = (item.cantidad / max) * 100;
              return (
                <div key={item.key} className="chart-bar-group">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <span className="chart-bar-value">{item.cantidad}</span>
                  </div>
                  <span className="chart-bar-label">{item.mes}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================
            FILA 3: Estado de investigaciones
        ============================================ */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>📋 Estado de investigaciones</h3>
            <span className="dashboard-card-badge">Total: {Object.values(estadosInvestigacion).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="dashboard-estados">
            {Object.entries(estadosInvestigacion).map(([estado, cantidad]) => {
              const colores = {
                'Borrador': '#F59E0B',
                'En revisión': '#3B82F6',
                'Aprobado': '#10B981',
                'Cerrado': '#6B7280'
              };
              const total = Object.values(estadosInvestigacion).reduce((a, b) => a + b, 0) || 1;
              const porcentaje = (cantidad / total) * 100;
              return (
                <div key={estado} className="estado-item">
                  <div className="estado-item-header">
                    <span className="estado-item-dot" style={{ background: colores[estado] || '#6B7280' }} />
                    <span className="estado-item-label">{estado}</span>
                    <span className="estado-item-count">{cantidad}</span>
                  </div>
                  <div className="estado-item-bar">
                    <div 
                      className="estado-item-bar-fill" 
                      style={{ 
                        width: `${porcentaje}%`,
                        background: colores[estado] || '#6B7280'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================
            FILA 4: Acciones
        ============================================ */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>📌 Acciones del plan</h3>
            <div className="dashboard-acciones-resumen">
              <span className="accion-badge abierta">🟡 {resumenAcciones.abiertas} abiertas</span>
              <span className="accion-badge vencida">🔴 {resumenAcciones.vencidas} vencidas</span>
              <span className="accion-badge finalizada">✅ {resumenAcciones.finalizadas} finalizadas</span>
            </div>
          </div>

          {accionesData.length === 0 ? (
            <p className="dashboard-empty">No hay acciones registradas.</p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Responsable</th>
                    <th>Abiertas</th>
                    <th>Vencidas</th>
                    <th>Finalizadas</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {accionesData.slice(0, 10).map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.responsable}</strong></td>
                      <td className="text-abiertas">{item.abiertas}</td>
                      <td className="text-vencidas">{item.vencidas}</td>
                      <td className="text-finalizadas">{item.finalizadas}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
