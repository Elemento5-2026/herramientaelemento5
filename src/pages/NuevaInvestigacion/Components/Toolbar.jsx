import "./Toolbar.css";

export default function Toolbar({

    fullscreen,

    onFullscreen,

    onCenter

}) {

    return (

        <div className="arbol-toolbar">

            <div>

                <h3>

                    Árbol de causas

                </h3>

            </div>

            <div className="toolbar-buttons">

                <button
                    className="btn-secondary"
                    onClick={onCenter}
                >

                    🧭 Centrar

                </button>

                <button
                    className="btn-primary"
                    onClick={onFullscreen}
                >

                    {fullscreen
                        ? "🗗 Restaurar"
                        : "⛶ Pantalla completa"}

                </button>

            </div>

        </div>

    );

}
