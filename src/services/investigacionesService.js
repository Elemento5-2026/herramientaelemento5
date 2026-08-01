import supabase from "../lib/supabase";

export async function crearInvestigacion(encabezado) {

  const { data, error } = await supabase
    .from("investigaciones")
    .insert([encabezado])
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function actualizarInvestigacion(id, encabezado) {

  const { data, error } = await supabase
    .from("investigaciones")
    .update(encabezado)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}
