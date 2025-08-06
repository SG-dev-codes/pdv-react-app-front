import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./Venta.css";
import api from "../api/axiosConfig";
import ventaApi from "../api/axiosVenta";


function Venta({ empleado }) {
    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [productosVenta, setProductosVenta] = useState([]);
    const [total, setTotal] = useState(0);

    const buscarProductos = async () => {
        const termino = busqueda.trim().toLowerCase();
        if (!termino) {
            setResultadosBusqueda([]);
            return;
        }

        try {
            const res = await api.get(`/buscar?nombre=${encodeURIComponent(termino)}`);
            const productos = Array.isArray(res.data) ? res.data : [res.data];

            if (productos.length === 0) {
                Swal.fire("No encontrado", "No hay productos que coincidan", "warning");
            }

            setResultadosBusqueda(productos);
        } catch (error) {
            console.error("Error al buscar productos:", error);
            Swal.fire("Error", "Ocurrió un error al buscar el producto", "error");
        }
    };

    const agregarProducto = (producto) => {
        setProductosVenta((prev) => {
            const index = prev.findIndex((p) => p.id === producto.id);
            if (index !== -1) {
                const copia = [...prev];
                if (copia[index].cantidad < producto.stock) {
                    copia[index].cantidad += 1;
                } else {
                    Swal.fire("Stock insuficiente", "No hay suficiente stock", "info");
                }
                return copia;
            } else {
                if (producto.stock > 0) {
                    return [...prev, { ...producto, cantidad: 1 }];
                } else {
                    Swal.fire("Sin stock", "Producto sin stock disponible", "info");
                    return prev;
                }
            }
        });
        setBusqueda("");
        setResultadosBusqueda([]);
    };

    const cambiarCantidad = (id, cantidadNueva) => {
        if (cantidadNueva < 1) return;
        setProductosVenta((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        cantidad:
                            cantidadNueva <= p.stock ? cantidadNueva : p.cantidad,
                    }
                    : p
            )
        );
    };

    useEffect(() => {
        const nuevoTotal = productosVenta.reduce(
            (acc, p) => acc + p.precio * p.cantidad,
            0
        );
        setTotal(nuevoTotal);
    }, [productosVenta]);

    const eliminarProducto = (id) => {
        setProductosVenta((prev) => prev.filter((p) => p.id !== id));
    };

    const realizarVenta = async () => {
        if (productosVenta.length === 0) {
            Swal.fire("Sin productos", "No hay productos para vender", "warning");
            return;
        }

        if (!empleado || !empleado.idempleado || !empleado.nombre) {
            Swal.fire("Error", "No se ha identificado correctamente al empleado", "error");
            return;
        }

        try {
            const detalles = productosVenta.map((p) => ({
                productoId: p.id,
                cantidad: p.cantidad,
                nombre: p.nombre,
                precioUnitario: p.precio,
                total: p.precio * p.cantidad,
            }));
            const totalVenta = detalles.reduce((acc, item) => acc + item.total, 0);

            const venta = {
                empleadoId: empleado.idempleado,
                empleadoNombre: empleado.nombre,
                productos: detalles,
                totalVenta,
            };
            console.log("Enviando venta:", venta);
            console.log("Api", ventaApi);

            await ventaApi.post("/realizar", venta);

            Swal.fire("Éxito", "Venta realizada con éxito", "success");

            setProductosVenta([]);
            setTotal(0);
        } catch (error) {
            console.error("Error al realizar venta:", error);
            Swal.fire("Error", "Ocurrió un error al realizar la venta", "error");
        }
    };

    return (
        <div className="venta-container">
            <h2>Venta - Punto de Venta</h2>
            <div className="busqueda-producto" style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre del producto"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            buscarProductos();
                        }
                    }}
                />
                <button onClick={buscarProductos}>Buscar</button>

                {resultadosBusqueda.length > 0 && (
                    <ul
                        style={{
                            position: "absolute",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            width: "100%",
                            maxHeight: "150px",
                            overflowY: "auto",
                            padding: 0,
                            marginTop: 0,
                            listStyleType: "none",
                            zIndex: 10,
                        }}
                    >
                        {resultadosBusqueda.map((producto) => (
                            <li
                                key={producto.id}
                                style={{ padding: "5px", cursor: "pointer" }}
                                onClick={() => agregarProducto(producto)}
                            >
                                {producto.nombre} - ${producto.precio.toFixed(2)} - Stock:{" "}
                                {producto.stock}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <table className="tabla-venta">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Importe</th>
                        <th>Stock</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {productosVenta.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>${p.precio.toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max={p.stock}
                                    value={p.cantidad}
                                    onChange={(e) =>
                                        cambiarCantidad(p.id, parseInt(e.target.value))
                                    }
                                />
                            </td>
                            <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button
                                    className="btn-eliminar"
                                    onClick={() => eliminarProducto(p.id)}
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                    {productosVenta.length === 0 && (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No hay productos en la venta
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="total-venta">
                <strong>Total a pagar: ${total.toFixed(2)}</strong>
            </div>

            <button className="btn-pagar" onClick={realizarVenta}>
                Pagar
            </button>
        </div>
    );
}

export default Venta;
