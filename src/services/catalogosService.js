import supabase from "../lib/supabase";

/**
 * Obtiene cualquier catálogo activo ordenado por nombre.
 * Ejemplo:
 * obtenerCatalogo("catalogo_gerencias")
 * obtenerCatalogo("catalogo_procesos")
 */
export async function obtenerCatalogo(tabla) {

  const { data, error } = await supabase
    .from(tabla)
    .select("*")
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;

  return data;

}

/**
 * Obtiene un catálogo por ID.
 */
export async function obtenerRegistro(tabla, id) {

  const { data, error } = await supabase
    .from(tabla)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

/**
 * Crea un registro en cualquier catálogo.
 */
export async function crearRegistro(tabla, registro) {

  const { data, error } = await supabase
    .from(tabla)
    .insert([registro])
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Actualiza un registro.
 */
export async function actualizarRegistro(tabla, id, registro) {

  const { data, error } = await supabase
    .from(tabla)
    .update(registro)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Activa o desactiva un registro.
 */
export async function cambiarEstado(tabla, id, activo) {

  const { data, error } = await supabase
    .from(tabla)
    .update({ activo })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/**
 * Elimina un registro físicamente.
 * (Solo usar si realmente deseas borrarlo.)
 */
export async function eliminarRegistro(tabla, id) {

  const { error } = await supabase
    .from(tabla)
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;

}
