import React from "react";
import "./MenuOpciones.css";

function MenuOpciones() {
    return (
        <div className="menu-opciones">
            <div className="menu-logo">
                <span className="sg-logo">SG</span>
            </div>
            <h2 className="menu-titulo">Punto de Venta</h2>

            <ul>
                <li>
                <a href="/obtenerProductos" className="menu-link">Inicio</a>
                </li>
                <li>
                    <a href="/obtenerProductos" className="menu-link">Productos</a>
                </li>
                <li>Ventas</li>
                <li>Empleados</li>
                <li>Configuración</li>
            </ul>
        </div>
    );
}

export default MenuOpciones;
