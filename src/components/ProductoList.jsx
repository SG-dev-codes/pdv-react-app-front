import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import BotonExportarExcel from "./BotonExportarExcel";

const ProductoList = ({ onEditar, rol, productos: productosProp }) => {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [orden, setOrden] = useState({ columna: null, direccion: "asc" });

  const cargarProductos = async (pagina = 0) => {
    try {
      const res = await api.get(`/obtenerProductos?page=${pagina}&size=10`);
      setProductos(res.data.productos || []);
      setTotalPaginas(res.data.totalPaginas || 1);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
      setTotalPaginas(1);
    }
  };

  useEffect(() => {
    // Solo cargar paginación si NO hay productos pasados desde el padre (es decir, sin filtro)
    if (!productosProp || productosProp.length === 0) {
      cargarProductos(paginaActual);
    } else {
      // Si hay productos por prop, los usamos directamente
      setProductos(productosProp);
      setTotalPaginas(1); // No mostrar paginación con filtro activo
    }
  }, [paginaActual, productosProp]);

  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/eliminar/${id}`);
      // Si estás usando filtro, quizás quieras recargar el filtro o cargar productos
      if (!productosProp || productosProp.length === 0) {
        cargarProductos(paginaActual);
      } else {
        // Si está filtrado, podrías disparar evento para recargar filtro (depende de tu lógica)
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 0 && nuevaPagina < totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };
  const cambiarOrden = (columna) => {
    if (orden.columna === columna) {
      setOrden({
        columna,
        direccion: orden.direccion === "asc" ? "desc" : "asc",
      });
    } else {
      setOrden({ columna, direccion: "asc" });
    }
  };

  const comparar = (a, b) => {
    const col = orden.columna;
    if (!col) return 0;

    let valA = a[col];
    let valB = b[col];

    // Para comparar strings case insensitive
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return orden.direccion === "asc" ? -1 : 1;
    if (valA > valB) return orden.direccion === "asc" ? 1 : -1;
    return 0;
  };

  const productosOrdenados = [...productos].sort(comparar);

  const flechaOrden = (columna) => {
    if (orden.columna !== columna) return null;
    return (
      <span style={{ marginLeft: "5px", color: "#0c0f13ff", fontWeight: "bold" }}>
        {orden.direccion === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (

    <div className="producto-list">
      <div className="info-productos">
        Mostrando <span>{productos.length}</span>
        <div>
          <BotonExportarExcel />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => cambiarOrden("nombre")}>
              Nombre{flechaOrden("nombre")}
            </th>
            <th onClick={() => cambiarOrden("descripcion")}>
              Descripción{flechaOrden("descripcion")}
            </th>
            <th onClick={() => cambiarOrden("precio")}>
              Precio{flechaOrden("precio")}
            </th>
            <th onClick={() => cambiarOrden("stock")}>
              Stock{flechaOrden("stock")}
            </th>
            <th onClick={() => cambiarOrden("estado")}>
              Estado{flechaOrden("estado")}
            </th>
            {rol === "admin" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.length === 0 ? (
            <tr>
              <td colSpan={rol === "admin" ? 6 : 5} style={{ textAlign: "center" }}>
                No hay productos para mostrar.
              </td>
            </tr>
          ) : (
            productosOrdenados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={p.activo ? "estado-activo" : "estado-inactivo"}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                {rol === "admin" && (
                  <td>
                    <button onClick={() => onEditar(p)}>Editar</button>
                    <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mostrar paginación solo si NO hay búsqueda activa */}
      {(!productosProp || productosProp.length === 0) && (
        <div className="paginacion">
          <span
            className={`pagina-control ${paginaActual === 0 ? "deshabilitado" : ""}`}
            onClick={() => {
              if (paginaActual > 0) cambiarPagina(paginaActual - 1);
            }}
          >
            &lt; Anterior
          </span>

          <span className="pagina-info">
            Página {paginaActual + 1} de {totalPaginas}
          </span>

          <span
            className={`pagina-control ${paginaActual + 1 >= totalPaginas ? "deshabilitado" : ""}`}
            onClick={() => {
              if (paginaActual + 1 < totalPaginas) cambiarPagina(paginaActual + 1);
            }}
          >
            Siguiente &gt;
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductoList;
