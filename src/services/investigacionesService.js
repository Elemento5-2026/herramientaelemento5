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
