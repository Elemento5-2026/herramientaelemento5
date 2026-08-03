import "./ArbolCausas.css";

import NodoArbol from "./NodoArbol";

export default function ArbolCausas() {

  return (

    <div className="arbol-causas">

      <div className="leyenda">

        <div className="leyenda-item fisica">

          Condición física

        </div>

        <div className="leyenda-item procedimiento">

          Procedimiento / Sistema

        </div>

        <div className="leyenda-item comportamiento">

          Comportamiento

        </div>

      </div>

      <div className="canvas-arbol">

        <NodoArbol />

      </div>

    </div>

  );

}
