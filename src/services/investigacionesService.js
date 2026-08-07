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
          accion.fecha_fin || null,

        // 🔥 NUEVO: fecha_propuesta
        fecha_propuesta:
          accion.fecha_propuesta || null

      })
      .select()
      .single();

    if (error) throw error;

    accionesGuardadas.push(data);

  }

  return accionesGuardadas;

}
