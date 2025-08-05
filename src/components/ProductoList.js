import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./ProductoList.css";

const ProductoList = ({ onEditar }) => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const res = await api.get("/obtenerProductos");
    setProductos(res.data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    await api.delete(`/eliminar/${id}`);
    cargarProductos();
  };

  return (
    <div className="producto-list">
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td>
                <button onClick={() => onEditar(p)}>Editar</button>
                <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
