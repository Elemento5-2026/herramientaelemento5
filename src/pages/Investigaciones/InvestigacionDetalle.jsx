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
onClick={() => setScreen("investigaciones")}
>

← Volver

</button>

<h1>

Investigación de Incidente

</h1>

<p>

Visualización de la investigación.

</p>

</div>

<div className="acciones-superiores">

<button className="btn-secondary">

🖨 Imprimir

</button>

<button className="btn-primary">

✏ Editar

</button>

</div>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Información General

</h2>

<hr/>

<div className="detalle-grid">

<div>

<label>Código</label>

<p>

INV-2026-0005

</p>

</div>

<div>

<label>Estado</label>

<p>

<span className="estado borrador">

Borrador

</span>

</p>

</div>

<div>

<label>Fecha</label>

<p>

05/08/2026

</p>

</div>

<div>

<label>Indicador</label>

<p>

Incidentes

</p>

</div>

</div>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Equipo Investigador

</h2>

<hr/>

<table className="tabla-detalle">

<thead>

<tr>

<th></th>

<th>Nombre</th>

<th>Puesto</th>

<th>Área</th>

<th>Fecha</th>

</tr>

</thead>

<tbody>

<tr>

<td>

Elaboró

</td>

<td>

Pablo Hernández

</td>

<td>

Jefe de Producción

</td>

<td>

Producción

</td>

<td>

05/08/2026

</td>

</tr>

<tr>

<td>

Revisó

</td>

<td>

José Suruy

</td>

<td>

...

</td>

<td>

...

</td>

<td>

...

</td>

</tr>

<tr>

<td>

Aprobó

</td>

<td>

Ricardo Estrada

</td>

<td>

...

</td>

<td>

...

</td>

<td>

...

</td>

</tr>

</tbody>

</table>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Identificación

</h2>

<hr/>

<div className="detalle-grid">

<div>

<label>

Macroproceso

</label>

<p>

Trefilación

</p>

</div>

<div>

<label>

Proceso

</label>

<p>

Línea 2

</p>

</div>

<div>

<label>

Dirección

</label>

<p>

Industrial

</p>

</div>

<div>

<label>

Gerencia

</label>

<p>

Producción

</p>

</div>

<div>

<label>

Área

</label>

<p>

Trefilación

</p>

</div>

<div>

<label>

Turno

</label>

<p>

A

</p>

</div>

</div>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Descripción del Incidente

</h2>

<hr/>

<p>

Aquí aparecerá la descripción completa del incidente...

</p>

<div className="galeria">

<img src="/placeholder.png"/>

<img src="/placeholder.png"/>

<img src="/placeholder.png"/>

</div>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Acciones Inmediatas

</h2>

<hr/>

<table className="tabla-detalle">

<thead>

<tr>

<th>#</th>

<th>Acción</th>

<th>Responsable</th>

<th>Inicio</th>

<th>Fin</th>

<th>Evidencia</th>

</tr>

</thead>

<tbody>

<tr>

<td>

1

</td>

<td>

Retirar material.

</td>

<td>

Juan Pérez

</td>

<td>

05/08/2026

</td>

<td>

06/08/2026

</td>

<td>

📷

</td>

</tr>

</tbody>

</table>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Árbol de Causas

</h2>

<hr/>

<div
style={{
height:700,
border:"1px solid #ddd",
borderRadius:8
}}
>

Aquí aparecerá React Flow

</div>

</div>

{/* ================================================= */}

<div className="detalle-card">

<h2>

Plan de Acción

</h2>

<hr/>

<table className="tabla-detalle">

<thead>

<tr>

<th>

Qué hacer

</th>

<th>

Cómo

</th>

<th>

Responsable

</th>

<th>

Inicio

</th>

<th>

Fin

</th>

<th>

Evidencia

</th>

</tr>

</thead>

<tbody>

<tr>

<td>

...

</td>

<td>

...

</td>

<td>

...

</td>

<td>

...

</td>

<td>

...

</td>

<td>

📷

</td>

</tr>

</tbody>

</table>

</div>

</div>

</Layout>

);
