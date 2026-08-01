import "./ArbolCausas.css";

export default function ArbolCausas() {

  return (

    <div className="arbol-causas">

      <div className="toolbar">

        <button className="btn-primary">
          + Agregar causa
        </button>

        <button className="btn-secondary">
          + Agregar causa raíz
        </button>

      </div>

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

      <div className="canvas-placeholder">

        <h3>Árbol de causas</h3>

        <p>

          Aquí se construirá el árbol de causas interactivo.

        </p>

        <p>

          El usuario podrá agregar cuadros, conectarlos y definir las
          causas raíz.

        </p>

      </div>

    </div>

  );

}
