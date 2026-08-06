import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    if (!investigacionId) return;
    cargarInvestigacion();
  }, [investigacionId]);

  async function cargarInvestigacion() {
    try {
      const data = await obtenerInvestigacionPorId(investigacionId);
      setInvestigacion(data);
    } catch (error) {
      console.error(error);
      alert(error.message || JSON.stringify(error));
    } finally {
      setCargando(false);
    }
  }

  // ============================================
  // EXPORTAR A PDF - CON autoTable
  // ============================================
  const exportarPDF = () => {
    if (!investigacion) return;
    
    setExportando(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = margin;

      // ============================================
      // FUNCIÓN PARA AGREGAR TÍTULO
      // ============================================
      const agregarTitulo = (texto) => {
        if (y > 260) {
          doc.addPage();
          y = margin;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text(texto, margin, y);
        y += 8;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      // ============================================
      // FUNCIÓN PARA AGREGAR CAMPO
      // ============================================
      const agregarCampo = (label, valor) => {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(75, 85, 99);
        doc.text(label + ':', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(31, 41, 55);
        
        const valorStr = valor || '-';
        const textLines = doc.splitTextToSize(valorStr, pageWidth - margin - 70);
        doc.text(textLines, margin + 55, y);
        y += (textLines.length * 5) + 4;
      };

      // ============================================
      // FUNCIÓN PARA AGREGAR TABLA CON autoTable
      // ============================================
      const agregarTabla = (headers, rows, titulo = '') => {
        if (!rows || rows.length === 0) return;
        
        if (titulo) {
          if (y > 240) {
            doc.addPage();
            y = margin;
          }
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(31, 41, 55);
          doc.text(titulo, margin, y);
          y += 6;
        }
        
        // Calcular anchos dinámicos
        const colCount = headers.length;
        let columnStyles = {};
        headers.forEach((header, i) => {
          if (i === 0) {
            columnStyles[i] = { cellWidth: 15 }; // Número
          } else if (i === headers.length - 1 || i === headers.length - 2) {
            columnStyles[i] = { cellWidth: 30 }; // Fechas
          } else {
            columnStyles[i] = { cellWidth: 'auto' };
          }
        });

        autoTable(doc, {
          startY: y,
          head: [headers],
          body: rows,
          theme: 'striped',
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [31, 41, 55]
          },
          columnStyles: columnStyles,
          margin: { left: margin, right: margin },
          styles: {
            overflow: 'linebreak',
            fontSize: 8,
            cellPadding: 2
          },
          didDrawPage: function(data) {
            // Actualizar y para continuar después de la tabla
            y = data.cursor.y + 6;
          }
        });
        
        // Actualizar y después de la tabla
        y = doc.lastAutoTable.finalY + 6;
      };

      // ============================================
      // ENCABEZADO DEL PDF
      // ============================================
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text('INVESTIGACIÓN', pageWidth / 2, y, { align: 'center' });
      y += 10;
      
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text(investigacion.codigo_controlado || 'Sin código', pageWidth / 2, y, { align: 'center' });
      y += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.text(`Estado: ${investigacion.estado || 'N/A'}`, pageWidth / 2, y, { align: 'center' });
      y += 10;
      
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      // ============================================
      // 1. ENCABEZADO
      // ============================================
      agregarTitulo('1. ENCABEZADO');
      
      // Participantes
      if (investigacion.participantes && investigacion.participantes.length > 0) {
        const participantesText = investigacion.participantes.map(p => 
          `${p.nombre || ''} (${p.puesto || ''})`
        ).join(', ');
        agregarCampo('Participantes', participantesText);
      }
      
      // Elaborado
      agregarCampo('Elaborado por', investigacion.elaborado_nombre || '');
      agregarCampo('Puesto', investigacion.elaborado_puesto || '');
      agregarCampo('Gerencia/Área', `${investigacion.elaborado_gerencia || ''} / ${investigacion.elaborado_area || ''}`);
      agregarCampo('Fecha', investigacion.elaborado_fecha ? new Date(investigacion.elaborado_fecha).toLocaleDateString() : '');
      
      // Revisado
      if (investigacion.revisado_nombre) {
        agregarCampo('Revisado por', investigacion.revisado_nombre || '');
        agregarCampo('Puesto', investigacion.revisado_puesto || '');
        agregarCampo('Fecha', investigacion.revisado_fecha ? new Date(investigacion.revisado_fecha).toLocaleDateString() : '');
      }
      
      // Aprobado
      if (investigacion.aprobado_nombre) {
        agregarCampo('Aprobado por', investigacion.aprobado_nombre || '');
        agregarCampo('Puesto', investigacion.aprobado_puesto || '');
        agregarCampo('Fecha', investigacion.aprobado_fecha ? new Date(investigacion.aprobado_fecha).toLocaleDateString() : '');
      }
      
      y += 4;

      // ============================================
      // 2. IDENTIFICACIÓN
      // ============================================
      agregarTitulo('2. IDENTIFICACIÓN');
      agregarCampo('Macroproceso', investigacion.macroproceso?.nombre || '');
      agregarCampo('Proceso', investigacion.proceso?.nombre || '');
      agregarCampo('Clasificación del incidente', investigacion.clasificacion?.nombre || '');
      agregarCampo('Turno', investigacion.turno?.nombre || '');
      agregarCampo('Indicador impactado', investigacion.indicador_impactado || '');
      y += 4;

      // ============================================
      // 3. DESCRIPCIÓN
      // ============================================
      agregarTitulo('3. DESCRIPCIÓN DEL INCIDENTE');
      agregarCampo('Descripción', investigacion.descripcion?.descripcion_incidente || '');
      agregarCampo('Parte del cuerpo lesionada', investigacion.descripcion?.parte_cuerpo?.nombre || '');
      y += 4;

      // ============================================
      // 4. ACCIONES INMEDIATAS
      // ============================================
      if (investigacion.acciones_inmediatas && investigacion.acciones_inmediatas.length > 0) {
        agregarTitulo('4. ACCIONES INMEDIATAS');
        const headers = ['#', 'Acción', 'Responsable', 'Inicio', 'Fin'];
        const rows = investigacion.acciones_inmediatas.map(a => [
          a.numero || '',
          a.accion_inmediata || '',
          a.responsable || '',
          a.fecha_inicio ? new Date(a.fecha_inicio).toLocaleDateString() : '',
          a.fecha_fin ? new Date(a.fecha_fin).toLocaleDateString() : ''
        ]);
        agregarTabla(headers, rows);
      }

      // ============================================
      // 5. PLAN DE ACCIÓN
      // ============================================
      if (investigacion.plan_accion && investigacion.plan_accion.length > 0) {
        agregarTitulo('5. PLAN DE ACCIÓN');
        const headers = ['#', 'Qué hacer', 'Cómo', 'Responsable', 'Inicio', 'Fin'];
        const rows = investigacion.plan_accion.map((a, i) => [
          i + 1,
          a.que_hacer || '',
          a.como || '',
          a.responsable || '',
          a.fecha_plan_inicio ? new Date(a.fecha_plan_inicio).toLocaleDateString() : '',
          a.fecha_plan_fin ? new Date(a.fecha_plan_fin).toLocaleDateString() : ''
        ]);
        agregarTabla(headers, rows);
      }

      // ============================================
      // 6. ÁRBOL DE CAUSAS
      // ============================================
      if (investigacion.arbol_causas && investigacion.arbol_causas.length > 0) {
        agregarTitulo('6. ÁRBOL DE CAUSAS');
        
        const causasPorNivel = {};
        investigacion.arbol_causas.forEach(nodo => {
          const nivel = nodo.nivel || 0;
          if (!causasPorNivel[nivel]) causasPorNivel[nivel] = [];
          causasPorNivel[nivel].push(nodo);
        });
        
        const niveles = Object.keys(causasPorNivel).sort();
        for (const nivel of niveles) {
          const nodos = causasPorNivel[nivel];
          for (const nodo of nodos) {
            const indent = '  '.repeat(parseInt(nivel));
            const categoria = nodo.categoria ? `[${nodo.categoria}] ` : '';
            agregarCampo(`${indent}Nivel ${nivel}`, `${categoria}${nodo.descripcion || ''}`);
          }
        }
      }

      // ============================================
      // PIE DE PÁGINA
      // ============================================
      const totalPages = doc.internal.pages.length;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Generado el ${new Date().toLocaleString()} - Página ${i} de ${totalPages}`,
          pageWidth / 2,
          287,
          { align: 'center' }
        );
      }

      // ============================================
      // GUARDAR PDF
      // ============================================
      doc.save(`Investigacion_${investigacion.codigo_controlado || 'reporte'}.pdf`);

    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert(`Error al generar el PDF: ${error.message}`);
    } finally {
      setExportando(false);
    }
  };

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
        
        {/* HEADER CON BOTÓN DE EXPORTAR */}
        <div className="page-header">
          <div className="page-header-left">
            <button
              className="btn-link"
              onClick={() => setScreen("investigaciones")}
            >
              ← Volver a investigaciones
            </button>
          </div>
          
          <div className="page-header-center">
            <h1>{investigacion.codigo_controlado}</h1>
            <p>Estado: {investigacion.estado}</p>
          </div>
          
          <div className="page-header-right">
            <button
              className="btn-exportar-pdf"
              onClick={exportarPDF}
              disabled={exportando}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                cursor: exportando ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: exportando ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!exportando) {
                  e.target.style.background = '#B91C1C';
                }
              }}
              onMouseLeave={(e) => {
                if (!exportando) {
                  e.target.style.background = '#DC2626';
                }
              }}
            >
              {exportando ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Generando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Exportar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* CONTENIDO PARA MOSTRAR EN PANTALLA */}
        <EncabezadoDetalle investigacion={investigacion} />
        <IdentificacionDetalle investigacion={investigacion} />
        <DescripcionDetalle investigacion={investigacion} />
        <AccionesInmediatasDetalle investigacion={investigacion} />
        <ArbolCausasDetalle investigacion={investigacion} />
        <PlanAccionDetalle investigacion={investigacion} />

      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E5E7EB;
          flex-wrap: wrap;
          gap: 12px;
        }

        .page-header-left {
          flex: 1;
        }

        .page-header-center {
          flex: 2;
          text-align: center;
        }

        .page-header-center h1 {
          margin: 0;
          color: #1F2937;
          font-size: 24px;
        }

        .page-header-center p {
          margin: 4px 0 0 0;
          color: #6B7280;
          font-size: 14px;
        }

        .page-header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .page-header-left {
            text-align: left;
          }

          .page-header-right {
            justify-content: center;
          }

          .page-header-center h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </Layout>
  );
}
