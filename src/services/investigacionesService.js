import supabase from "../lib/supabase";

/**
 * Guarda el Encabezado (crea la investigación)
 */
export async function guardarEncabezado(formulario) {

  const { data, error } = await supabase
    .from("investigaciones")
    .insert([{

      codigo_controlado: formulario.codigo_controlado,
      estado: "Borrador",

      participantes: formulario.participantes,

      elaborado_nombre: formulario.elaborado_nombre,
      elaborado_puesto: formulario.elaborado_puesto,
      elaborado_gerencia: formulario.elaborado_gerencia,
      elaborado_area: formulario.elaborado_area,
      elaborado_fecha: formulario.elaborado_fecha,

      revisado_nombre: formulario.revisado_nombre,
      revisado_puesto: formulario.revisado_puesto,
      revisado_gerencia: formulario.revisado_gerencia,
      revisado_area: formulario.revisado_area,
      revisado_fecha: formulario.revisado_fecha,

      aprobado_nombre: formulario.aprobado_nombre,
      aprobado_puesto: formulario.aprobado_puesto,
      aprobado_gerencia: formulario.aprobado_gerencia,
      aprobado_area: formulario.aprobado_area,
      aprobado_fecha: formulario.aprobado_fecha

    }])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Actualiza el encabezado de una investigación
 */
export async function actualizarEncabezado(formulario) {

  const { data, error } = await supabase
    .from("investigaciones")
    .update({

      participantes: formulario.participantes,

      elaborado_nombre: formulario.elaborado_nombre,
      elaborado_puesto: formulario.elaborado_puesto,
      elaborado_gerencia: formulario.elaborado_gerencia,
      elaborado_area: formulario.elaborado_area,
      elaborado_fecha: formulario.elaborado_fecha,

      revisado_nombre: formulario.revisado_nombre,
      revisado_puesto: formulario.revisado_puesto,
      revisado_gerencia: formulario.revisado_gerencia,
      revisado_area: formulario.revisado_area,
      revisado_fecha: formulario.revisado_fecha,

      aprobado_nombre: formulario.aprobado_nombre,
      aprobado_puesto: formulario.aprobado_puesto,
      aprobado_gerencia: formulario.aprobado_gerencia,
      aprobado_area: formulario.aprobado_area,
      aprobado_fecha: formulario.aprobado_fecha

    })
    .eq("id", formulario.id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Guarda la Identificación
 */
export async function guardarIdentificacion(
  investigacionId,
  formulario
) {

  const { data, error } = await supabase
    .from("investigaciones")
    .update({

      macroproceso_id: formulario.macroproceso_id,
      proceso_id: formulario.proceso_id,
      clasificacion_incidente_id: formulario.clasificacion_incidente_id,
      turno_id: formulario.turno_id,
      indicador_impactado: formulario.indicador_impactado

    })
    .eq("id", investigacionId)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Guarda la Descripción
 */
export async function guardarDescripcion(
  investigacionId,
  formulario
) {


  const { data: existente, error: errorBusqueda } = await supabase
    .from("investigaciones_descripcion")
    .select("id")
    .eq("investigacion_id", investigacionId)
    .maybeSingle();

  if (errorBusqueda) throw errorBusqueda;

  if (existente) {

    const { data, error } = await supabase
      .from("investigaciones_descripcion")
      .update({

        descripcion_incidente: formulario.descripcion_incidente,
        parte_cuerpo_lesionada_id:
          formulario.parte_cuerpo_lesionada_id

      })
      .eq("investigacion_id", investigacionId)
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  const { data, error } = await supabase
    .from("investigaciones_descripcion")
    .insert([{

      investigacion_id: investigacionId,

      descripcion_incidente:
        formulario.descripcion_incidente,

      parte_cuerpo_lesionada_id:
        formulario.parte_cuerpo_lesionada_id

    }])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Guarda las Acciones Inmediatas
 */
export async function guardarAccionesInmediatas(
  investigacionId,
  acciones
) {

  if (!acciones || acciones.length === 0) return [];

  const { error: errorDelete } =
    await supabase
      .from("investigaciones_acciones_inmediatas")
      .delete()
      .eq("investigacion_id", investigacionId);

  if (errorDelete) throw errorDelete;

  const accionesGuardadas = [];

  for (const accion of acciones) {

    const { data, error } = await supabase
      .from("investigaciones_acciones_inmediatas")
      .insert({

        investigacion_id: investigacionId,

        numero: accion.numero,

        accion_inmediata: accion.accion_inmediata,

        como: null,

        responsable: accion.responsable,

        fecha_inicio: accion.fecha_inicio||null,

        fecha_fin: accion.fecha_fin|| null

      })
      .select()
      .single();

    if (error) throw error;

    accionesGuardadas.push(data);

  }

  return accionesGuardadas;

}

/**
 * Guarda el Plan de Acción
 */
export async function guardarPlanAccion(
  investigacionId,
  acciones
) {

  if (!acciones || acciones.length === 0) return [];

  const { error: errorDelete } =
    await supabase
      .from("investigaciones_plan_accion")
      .delete()
      .eq("investigacion_id", investigacionId);

  if (errorDelete) throw errorDelete;

  const accionesGuardadas = [];

  for (const accion of acciones) {

    const { data, error } = await supabase
      .from("investigaciones_plan_accion")
      .insert({

        investigacion_id: investigacionId,

        causa_id: null,

        que_hacer: accion.que_hacer,

        como: accion.como,

        responsable: accion.responsable,

        fecha_plan_inicio:
          accion.fecha_inicio || null,

        fecha_plan_fin:
          accion.fecha_fin || null

      })
      .select()
      .single();

    if (error) throw error;

    accionesGuardadas.push(data);

  }

  return accionesGuardadas;

}

/**
 * Guarda el Árbol de Causas
 */
export async function guardarArbolCausas(
  investigacionId,
  nodos
) {

  if (!nodos || nodos.length === 0) return;

  // Eliminar árbol anterior
  const { error: errorDelete } =
    await supabase
      .from("investigaciones_arbol_causas")
      .delete()
      .eq("investigacion_id", investigacionId);

  if (errorDelete) throw errorDelete;

  // Insertar nuevamente
  for (let i = 0; i < nodos.length; i++) {

    const nodo = nodos[i];

    const { error } =
      await supabase
        .from("investigaciones_arbol_causas")
        .insert({

          id: nodo.id,

          investigacion_id: investigacionId,

          padre_id: nodo.data.parentId,

          descripcion: nodo.data.label,

          categoria: nodo.data.tipo,

          posicion_x: nodo.position.x,

          posicion_y: nodo.position.y,

          orden: i + 1

        });

    if (error) throw error;

  }

}

/**
 * Sube las evidencias de la descripción
 */
export async function subirEvidencias(
  moduloOrigen,
  moduloId,
  archivos
){

  if (!archivos || archivos.length === 0) return;

  for (const archivo of archivos) {

    const extension =
  archivo.name.split(".").pop();

const nombreStorage =
  `${crypto.randomUUID()}.${extension}`;

    const ruta =
  `${moduloOrigen}/${moduloId}/${nombreStorage}`;

    const { error: errorStorage } =
      await supabase.storage
        .from("investigaciones")
        .upload(
          ruta,
          archivo
        );

    if (errorStorage) throw errorStorage;

    const { error } = await supabase
      .from("investigaciones_evidencias")
      .insert({

        modulo_origen: moduloOrigen,

modulo_id: moduloId,

        descripcion: null,

        nombre_original: archivo.name,

        nombre_storage: nombreStorage,

        ruta_storage: ruta,

        tipo_archivo: archivo.type,

        tamano_bytes: archivo.size

      });

    if (error) throw error;

  }

}

/**
 * Crea una investigación desde un incidente
 */
export async function crearInvestigacionDesdeIncidente(
  incidente
) {

  // Verificar si el incidente ya tiene investigación
  if (incidente.investigacion_id) {
    throw new Error(
      "Este incidente ya tiene una investigación."
    );
  }

  // Buscar el último código TF
  const { data: ultimo } = await supabase
    .from("investigaciones")
    .select("codigo_controlado")
    .order("created_at", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

  let consecutivo = 1;

  if (ultimo?.codigo_controlado) {
    const partes = ultimo.codigo_controlado.split("-");
    const ultimoNumero = Number(partes[2]);
    if (!isNaN(ultimoNumero)) {
      consecutivo = ultimoNumero + 1;
    }
  }

  const codigo =
    `TF-${new Date().getFullYear()}-${String(consecutivo).padStart(6, "0")}`;

  // Crear la investigación
  const {
    data: investigacion,
    error
  } = await supabase
    .from("investigaciones")
    .insert({
      codigo_controlado: codigo,
      estado: "Borrador",
      incidente_id: incidente.id
    })
    .select()
    .single();

  if (error) throw error;

  // Actualizar el incidente
  const {
    error: errorIncidente
  } = await supabase
    .from("incidentes")
    .update({
      investigacion_id: investigacion.id
    })
    .eq("id", incidente.id);

  if (errorIncidente) throw errorIncidente;

  return investigacion;
}

/**
 * Obtiene una investigación completa con todas sus relaciones
 */
export async function obtenerInvestigacionPorId(id) {

  // Investigación
  const {
    data: investigacion,
    error: errorInvestigacion
  } = await supabase
    .from("investigaciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (errorInvestigacion) throw errorInvestigacion;

  if (!investigacion) {
    throw new Error("Investigación no encontrada");
  }

  // Descripción
  const {
    data: descripcion,
    error: errorDescripcion
  } = await supabase
    .from("investigaciones_descripcion")
    .select("*")
    .eq("investigacion_id", id)
    .maybeSingle();

  if (errorDescripcion) throw errorDescripcion;

  // Acciones inmediatas
  const {
    data: accionesInmediatas,
    error: errorAcciones
  } = await supabase
    .from("investigaciones_acciones_inmediatas")
    .select("*")
    .eq("investigacion_id", id)
    .order("numero");

  if (errorAcciones) throw errorAcciones;

  // Plan de acción
  const {
    data: planAccion,
    error: errorPlan
  } = await supabase
    .from("investigaciones_plan_accion")
    .select("*")
    .eq("investigacion_id", id);

  if (errorPlan) throw errorPlan;

  // Árbol de causas
  const {
    data: arbolCausas,
    error: errorArbol
  } = await supabase
    .from("investigaciones_arbol_causas")
    .select("*")
    .eq("investigacion_id", id)
    .order("orden");

  if (errorArbol) throw errorArbol;

  return {

    ...investigacion,

    descripcion,

    acciones_inmediatas: accionesInmediatas ?? [],

    plan_accion: planAccion ?? [],

    arbol_causas: arbolCausas ?? []

  };

}
