import supabase from "../../lib/supabase";

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
 * Guarda una evidencia en la base de datos.
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
 * Elimina una evidencia de la base de datos.
 */
export async function eliminarEvidencia(id) {

  const { error } = await supabase
    .from("investigaciones_evidencias")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;

}

/**
 * Sube un archivo al bucket de Storage.
 */
export async function subirArchivoStorage(
  moduloOrigen,
  moduloId,
  archivo
) {

  const nombreStorage =
    `${moduloOrigen}/${moduloId}/${Date.now()}_${archivo.name}`;

  const { data, error } = await supabase.storage
    .from("investigaciones")
    .upload(nombreStorage, archivo);

  if (error) throw error;

  return {

    nombreStorage,
    rutaStorage: data.path

  };

}

/**
 * Elimina un archivo del Storage.
 */
export async function eliminarArchivoStorage(rutaStorage) {

  const { error } = await supabase.storage
    .from("investigaciones")
    .remove([rutaStorage]);

  if (error) throw error;

  return true;

}
