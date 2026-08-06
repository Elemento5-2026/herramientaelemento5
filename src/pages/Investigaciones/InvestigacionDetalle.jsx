import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const contenidoRef = useRef(null);

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
  // EXPORTAR A PDF
  // ============================================
  const exportarPDF = async () => {
    if (!contenidoRef.current) return;
    
    setExportando(true);
    
    try {
      // Mostrar mensaje de carga
      const loadingMsg = document.createElement('div');
      loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 18px;
        font-weight: 500;
      `;
      loadingMsg.textContent = '⏳ Generando PDF...';
      document.body.appendChild(loadingMsg);

      // Capturar el contenido
      const canvas = await html2canvas(contenidoRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: contenidoRef.current.scrollWidth,
        height: contenidoRef.current.scrollHeight,
        windowWidth: contenidoRef.current.scrollWidth,
        windowHeight: contenidoRef.current.scrollHeight
      });

      // Remover mensaje de carga
      document.body.removeChild(loadingMsg);

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Si la imagen es más grande que una página, dividir en varias
      let heightLeft = imgHeight * ratio;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      // Páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      // Guardar PDF
      const nombreArchivo = `Investigacion_${investigacion.codigo_controlado || 'reporte'}.pdf`;
      pdf.save(nombreArchivo);

    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.');
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

        {/* CONTENIDO PARA EXPORTAR */}
        <div ref={contenidoRef} className="contenido-pdf">
          <EncabezadoDetalle investigacion={investigacion} />
          <IdentificacionDetalle investigacion={investigacion} />
          <DescripcionDetalle investigacion={investigacion} />
          <AccionesInmediatasDetalle investigacion={investigacion} />
          <ArbolCausasDetalle investigacion={investigacion} />
          <PlanAccionDetalle investigacion={investigacion} />
        </div>

      </div>

      {/* Estilos para animación y el header */}
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

        /* Estilos para el contenido del PDF */
        .contenido-pdf {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        /* Asegurar que todo se vea bien en el PDF */
        .contenido-pdf .detalle-card {
          page-break-inside: avoid;
          margin-bottom: 20px;
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
