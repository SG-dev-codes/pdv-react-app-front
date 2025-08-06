// src/App.jsx
import React, { useState, useEffect } from "react";
import ProductoList from "./components/ProductoList";
import ProductoForm from "./components/ProductoForm";
import MenuDerecho from "./components/MenuOpciones";
import VistaLogin from "./components/VistaLogin";
import EmpleadosList from "./components/EmpleadosList";
import Registrar from "./components/Registrar";
import Inicio from "./components/Inicio";
import Venta from "./components/Venta";
import DetalleVentaList from "./components/DetalleVenta";
import api from "./api/axiosConfig";


import "./App.css";

function App() {
  // Estados de control
  const [productoEditado, setProductoEditado] = useState(null);
  const [recargar, setRecargar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [vistaActual, setVistaActual] = useState("inicio"); // Cambia el valor inicial a "inicio"
  const [empleadoEditado, setEmpleadoEditado] = useState(null);

  // Recuperar sesión del localStorage al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setIsLogged(true);
      setVistaActual("productos"); // Si ya hay sesión, mostrar productos
    }
  }, []);

  // Handlers
  const handleEditarProducto = (producto) => {
    setProductoEditado(producto);
    setMostrarFormulario(true);
  };

  const handleCrearProducto = () => {
    setProductoEditado(null);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditado(null);
    setEmpleadoEditado(null);
    setRecargar(!recargar); // Forzar recarga
  };

  const handleLoginSuccess = (empleado) => {
    setUsuario(empleado);
    setIsLogged(true);
    setMostrarFormulario(false);
    localStorage.setItem("usuario", JSON.stringify(empleado));
    setVistaActual("productos"); // Mostrar productos tras login
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsuario(null);
    setMostrarFormulario(false);
    localStorage.removeItem("usuario");
    setVistaActual("inicio"); // Volver a inicio al cerrar sesión
  };

  const obtenerIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return "";
    return nombreCompleto
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  const handleCrearEmpleado = () => {
    setEmpleadoEditado(null);
    setMostrarFormulario(true);
  };

  const handleEditarEmpleado = (empleado) => {
    setEmpleadoEditado(empleado);
    setMostrarFormulario(true);
  };

  const manejarBusqueda = async (termino) => {
    setBusqueda(termino);

    if (termino.trim() === "") {
      // Cargar todos los productos
      try {
        const res = await api.get("/productos");
        setProductosFiltrados(res.data);
      } catch (error) {
        console.error("Error cargando productos", error);
        setProductosFiltrados([]);
      }
      return;
    }

    // Si hay término, buscar filtrados
    try {
      const res = await api.get(`/buscar?nombre=${encodeURIComponent(termino)}`);
      setProductosFiltrados(res.data);
    } catch (error) {
      console.error("Error buscando productos", error);
      setProductosFiltrados([]);
    }
  };

  const onInputChange = (e) => {
    manejarBusqueda(e.target.value);
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      manejarBusqueda(busqueda);
    }
  };



  return (
    <div className="app-wrapper">
      <div className="app-container">
        {!isLogged ? (
          <VistaLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {mostrarFormulario ? (
              <div className="form-center">
                {vistaActual === "productos" ? (
                  <ProductoForm
                    productoEditado={productoEditado}
                    onProductoGuardado={cerrarFormulario}
                    onCancelar={cerrarFormulario}
                  />
                ) : (
                  <Registrar
                    empleadoEditado={empleadoEditado}
                    onEmpleadoGuardado={cerrarFormulario}
                    onCancelar={cerrarFormulario}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="list-header-serch">
                  {vistaActual === "productos" && (
                    <div className="list-header-serch">
                      <div className="busqueda-container">
                        <input
                          type="text"
                          placeholder="Buscar producto..."
                          className="input-busqueda"
                          value={busqueda}
                          onChange={onInputChange}
                          onKeyDown={onInputKeyDown}
                        />
                      </div>
                    </div>
                  )}

                  <div className="usuario-info">
                    <div className="avatar-circle">
                      {obtenerIniciales(usuario?.nombre)}
                    </div>
                    <div>
                      <span className="usuario-nombre">{usuario?.nombre}</span>
                      <br />
                      <span className="usuario-rol">{usuario?.rol}</span>
                    </div>
                  </div>
                </div>

                <div className="list-header-container">
                  <h2>
                    {vistaActual === "inicio"
                      ? "Inicio"
                      : vistaActual === "ventas"
                        ? "Ventas"
                        : vistaActual === "detalle-ventas"
                          ? "Detalle Venta"
                          : vistaActual === "productos"
                            ? "Productos"
                            : "Empleados"
                    }
                  </h2>

                  {vistaActual === "productos" ? (
                    <button onClick={handleCrearProducto} className="crear-btn">
                      + Crear nuevo producto
                    </button>
                  ) : vistaActual === "empleados" ? (
                    <button onClick={handleCrearEmpleado} className="crear-btn">
                      + Crear nuevo empleado
                    </button>
                  ) : null}
                </div>

                {vistaActual === "inicio" ? (
                  <Inicio />
                ) : vistaActual === "productos" ? (
                  <ProductoList
                    key={recargar}
                    onEditar={handleEditarProducto}
                    rol={usuario?.rol}
                    productos={productosFiltrados}
                  />
                ) : vistaActual === "empleados" ? (
                  <EmpleadosList onEditar={handleEditarEmpleado} />
                ) : vistaActual === "ventas" ? (
                  <Venta empleado={usuario} />
                ) : vistaActual === "detalle-ventas" ? (
                  <DetalleVentaList />
                ) : null}
              </>
            )}
          </>
        )}
      </div>

      {/* Menú lateral */}
      {isLogged && (
        <MenuDerecho
          usuario={usuario}
          rol={usuario?.rol}
          onLogout={handleLogout}
          onCambiarVista={(nuevaVista) => {
            setMostrarFormulario(false); // Cerrar cualquier formulario abierto
            setVistaActual(nuevaVista);
          }}
          vistaActual={vistaActual}
        />
      )}
    </div>
  );
}

export default App;
