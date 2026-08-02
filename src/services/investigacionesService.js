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
export async function guardarIdentificacion(investigacionId, formulario) {

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
