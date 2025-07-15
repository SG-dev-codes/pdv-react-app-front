import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      const res = await api.get("/obtenerProductos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/eliminar/${id}`);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} - ${p.precio}
            <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductoList;
