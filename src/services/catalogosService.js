export async function obtenerCatalogo(tabla) {

  const consulta = supabase
    .from(tabla)
    .select("*");

  console.log("QUERY:", consulta);

  const { data, error, status } = await consulta;

  console.log("TABLA:", tabla);
  console.log("STATUS:", status);
  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  return data;

}
