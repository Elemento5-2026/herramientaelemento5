/**
 * Obtiene una investigación completa con todas sus relaciones (Versión optimizada)
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

  // Evidencias de la descripción
  let evidenciasDescripcion = [];

  if (descripcion) {
    const {
      data,
      error
    } = await supabase
      .from("investigaciones_evidencias")
      .select("*")
      .eq("modulo_origen", "descripciones")
      .eq("modulo_id", descripcion.id);

    if (error) throw error;

    evidenciasDescripcion = data;
  }

  // ============================================
  // TODAS LAS CONSULTAS EN PARALELO (MÁS RÁPIDO)
  // ============================================
  
  const [
    macroprocesoResult,
    procesoResult,
    clasificacionResult,
    turnoResult,
    parteCuerpoResult,
    accionesInmediatasResult,
    planAccionResult,
    arbolCausasResult
  ] = await Promise.all([
    // Macroproceso
    supabase
      .from("catalogo_macroprocesos")
      .select("id, nombre")
      .eq("id", investigacion.macroproceso_id)
      .maybeSingle(),
    
    // Proceso
    supabase
      .from("catalogo_procesos")
      .select("id, nombre")
      .eq("id", investigacion.proceso_id)
      .maybeSingle(),
    
    // Clasificación
    supabase
      .from("catalogo_tipos_incidente")
      .select("id, nombre")
      .eq("id", investigacion.clasificacion_incidente_id)
      .maybeSingle(),
    
    // Turno
    supabase
      .from("catalogo_turnos")
      .select("id, nombre")
      .eq("id", investigacion.turno_id)
      .maybeSingle(),
    
    // Parte del cuerpo (solo si existe)
    descripcion?.parte_cuerpo_lesionada_id
      ? supabase
          .from("catalogo_partes_cuerpo")
          .select("id, nombre")
          .eq("id", descripcion.parte_cuerpo_lesionada_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    
    // Acciones inmediatas
    supabase
      .from("investigaciones_acciones_inmediatas")
      .select("*")
      .eq("investigacion_id", id)
      .order("numero"),
    
    // Plan de acción
    supabase
      .from("investigaciones_plan_accion")
      .select("*")
      .eq("investigacion_id", id),
    
    // Árbol de causas
    supabase
      .from("investigaciones_arbol_causas")
      .select("*")
      .eq("investigacion_id", id)
      .order("orden")
  ]);

  // Extraer los datos de los resultados
  const macroproceso = macroprocesoResult.data;
  const proceso = procesoResult.data;
  const clasificacion = clasificacionResult.data;
  const turno = turnoResult.data;
  const parteCuerpo = parteCuerpoResult.data;
  const accionesInmediatas = accionesInmediatasResult.data ?? [];
  const planAccion = planAccionResult.data ?? [];
  const arbolCausas = arbolCausasResult.data ?? [];

  // Manejar errores individuales si es necesario
  if (macroprocesoResult.error) console.error("Error en macroproceso:", macroprocesoResult.error);
  if (procesoResult.error) console.error("Error en proceso:", procesoResult.error);
  if (clasificacionResult.error) console.error("Error en clasificación:", clasificacionResult.error);
  if (turnoResult.error) console.error("Error en turno:", turnoResult.error);
  if (accionesInmediatasResult.error) console.error("Error en acciones inmediatas:", accionesInmediatasResult.error);
  if (planAccionResult.error) console.error("Error en plan de acción:", planAccionResult.error);
  if (arbolCausasResult.error) console.error("Error en árbol de causas:", arbolCausasResult.error);

  // ============================================
  // RETORNAR CON TODOS LOS DATOS
  // ============================================
  
  return {

    ...investigacion,

    // Datos de catálogos
    macroproceso,
    proceso,
    clasificacion,
    turno,

    descripcion: descripcion
      ? {
          ...descripcion,
          parte_cuerpo: parteCuerpo,
          evidencias: evidenciasDescripcion
        }
      : null,

    acciones_inmediatas: accionesInmediatas ?? [],

    plan_accion: planAccion ?? [],

    arbol_causas: arbolCausas ?? []

  };

}
