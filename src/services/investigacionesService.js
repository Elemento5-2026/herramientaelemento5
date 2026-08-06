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

  // Catálogos de Identificación
  const { data: macroproceso } = await supabase
    .from("catalogo_macroprocesos")
    .select("nombre")
    .eq("id", investigacion.macroproceso_id)
    .maybeSingle();

  const { data: proceso } = await supabase
    .from("catalogo_procesos")
    .select("nombre")
    .eq("id", investigacion.proceso_id)
    .maybeSingle();

  const { data: clasificacion } = await supabase
    .from("catalogo_tipos_incidente")
    .select("nombre")
    .eq("id", investigacion.clasificacion_incidente_id)
    .maybeSingle();

  const { data: turno } = await supabase
    .from("catalogo_turnos")
    .select("nombre")
    .eq("id", investigacion.turno_id)
    .maybeSingle();

  // Parte del cuerpo lesionada
  let parteCuerpo = null;

  if (descripcion?.parte_cuerpo_lesionada_id) {
    const { data } = await supabase
      .from("catalogo_partes_cuerpo")
      .select("nombre")
      .eq("id", descripcion.parte_cuerpo_lesionada_id)
      .maybeSingle();

    parteCuerpo = data;
  }

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
