import React from "react";
import "./MenuOpciones.css";

function MenuOpciones({ onLogout, onCambiarVista, vistaActual, rol }) {
  const manejarClick = (e, vista) => {
    e.preventDefault(); // ❗ Previene la recarga de página
    onCambiarVista(vista);
    console.log("Rol del usuario en menú:", rol);

  };


  return (
    <div className="menu-opciones">
      <div className="menu-logo">
        <span className="sg-logo">SG</span>
      </div>
      <h2 className="menu-titulo">Punto de Venta</h2>

      <ul className="menu-lista">
        <li>
          <a
            href="#"
            className={`menu-link ${vistaActual === "inicio" ? "activo" : ""}`}
            onClick={(e) => manejarClick(e, "inicio")}
          >
            Inicio
          </a>
        </li>
        <li>
          <a
            href="/productos"
            className={`menu-link ${vistaActual === "productos" ? "activo" : ""}`}
            onClick={(e) => manejarClick(e, "productos")}
          >
            Inventario
          </a>
        </li>
        {rol === "admin" && (
          <li>
            <a
              href="#"
              className={`menu-link ${vistaActual === "empleados" ? "activo" : ""}`}
              onClick={(e) => {
                e.preventDefault(); // Evita que la página recargue
                manejarClick(e, "empleados");
              }}
            >
              Empleados
            </a>
          </li>
        )}

        <li>
          <a
            href="#"
            className={`menu-link ${vistaActual === "ventas" ? "activo" : ""}`}
            onClick={(e) => manejarClick(e, "ventas")}
          >
            Venta
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`menu-link ${vistaActual === "detalle-ventas" ? "activo" : ""}`}
            onClick={(e) => manejarClick(e, "detalle-ventas")}
          >
            Detalle ventas
          </a>
        </li>
      </ul>

      <div className="logout-container">
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default MenuOpciones;
