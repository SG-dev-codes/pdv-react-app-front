import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Swal from 'sweetalert2';

const ProductoForm = ({ productoEditado, onProductoGuardado, onCancelar }) => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    activo: true,
  });

  // Si se está editando, llena el formulario
  useEffect(() => {
    if (productoEditado) {
      setProducto(productoEditado);
    }
  }, [productoEditado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (producto.id) {
      await api.put(`/actualizar/${producto.id}`, producto);
    } else {
      await api.post("/crear", producto);
    }

    setProducto({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: "",
      activo: true,
    });

    onProductoGuardado(); // recargar lista

    Swal.fire({
      icon: 'success',
      title: producto.id ? '¡Producto actualizado!' : '¡Producto agregado!',
      text: producto.id
        ? 'El producto se ha actualizado correctamente.'
        : 'El producto se ha guardado correctamente.',
      timer: 1800,
      showConfirmButton: false
    });
  };

  return (
    <form className="producto-form" onSubmit={handleSubmit}>
      <h2>{producto.id ? "Editar Producto" : "Nuevo Producto"}</h2>
      <input name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" required />
      <input name="precio" type="number" value={producto.precio} onChange={handleChange} placeholder="Precio" required />
      <input name="stock" type="text" value={producto.stock} onChange={handleChange} placeholder="Stock" required />
      <button type="submit">{producto.id ? "Actualizar" : "Crear"}</button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  );
};

export default ProductoForm;
