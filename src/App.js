import React, { useState } from "react";
import ProductoList from "./components/ProductoList";
import ProductoForm from "./components/ProductoForm";
import MenuDerecho from "./components/MenuOpciones"; // 👈 Importar el menú
import "./App.css";

function App() {
  const [productoEditado, setProductoEditado] = useState(null);
  const [recargar, setRecargar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const manejarEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarFormulario(true);
  };

  const manejarCrear = () => {
    setProductoEditado(null);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditado(null);
    setRecargar(!recargar);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {mostrarFormulario && (
          <div className="form-center">
            <ProductoForm
              productoEditado={productoEditado}
              onProductoGuardado={cerrarFormulario}
            />
          </div>
        )}

        {!mostrarFormulario && (
          <>
            <div className="list-header-container">
              <h2>Productos</h2>
              <button onClick={manejarCrear} className="crear-btn">
                + Crear nuevo producto
              </button>
            </div>
            <ProductoList key={recargar} onEditar={manejarEdicion} />
          </>
        )}
      </div>

      <MenuDerecho />
    </div>
  );
}

export default App;
