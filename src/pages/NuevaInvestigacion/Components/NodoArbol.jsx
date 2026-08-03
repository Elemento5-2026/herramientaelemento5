import { useState } from "react";
import "./NodoArbol.css";

export default function NodoArbol() {

  const [texto, setTexto] = useState("");

  const [hijos, setHijos] = useState([]);

  const agregarHijo = () => {

    setHijos((anteriores) => [

      ...anteriores,

      {
        id: Date.now() + Math.random()
      }

    ]);

  };

  const eliminarHijo = (id) => {

    setHijos((anteriores) =>

      anteriores.filter((hijo) => hijo.id !== id)

    );

  };

  return (

    <div className="nodo-container">

      <div className="nodo">

        <textarea
          rows="3"
          value={texto}
          placeholder="Escriba la causa..."
          onChange={(e) => setTexto(e.target.value)}
        />

        <div className="nodo-botones">

          <button
            type="button"
            className="btn-primary"
            onClick={agregarHijo}
          >

            ➕ Agregar causa

          </button>

        </div>

      </div>

      {hijos.length > 0 && (

        <div className="hijos">

          {hijos.map((hijo) => (

            <div
              key={hijo.id}
              className="hijo"
            >

              <div className="linea"></div>

              <NodoArbol />

              <button
                type="button"
                className="btn-delete"
                onClick={() => eliminarHijo(hijo.id)}
              >

                🗑 Eliminar

              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}
