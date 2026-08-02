import supabase from "../lib/supabase";

/**
 * Obtiene las evidencias de un módulo.
 */
export async function obtenerEvidencias(
  moduloOrigen,
  moduloId
) {

  const { data, error } = await supabase
    .from("investigaciones_evidencias")
    .select("*")
    .eq("modulo_origen", moduloOrigen)
    .eq("modulo_id", moduloId)
    .order("created_at");

  if (error) throw error;

  return data;

}

/**
 * Guarda una evidencia.
 */
export async function guardarEvidencia(evidencia) {

  const { data, error } = await supabase
    .from("investigaciones_evidencias")
    .insert([evidencia])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Elimina una evidencia.
 */
export async function eliminarEvidencia(id) {

  const { error } = await supabase
    .from("investigaciones_evidencias")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;

}
