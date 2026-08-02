export function guardar(clave, valor) {

  localStorage.setItem(
    clave,
    JSON.stringify(valor)
  );

}

export function obtener(clave) {

  const valor = localStorage.getItem(clave);

  return valor ? JSON.parse(valor) : null;

}

export function eliminar(clave) {

  localStorage.removeItem(clave);

}
