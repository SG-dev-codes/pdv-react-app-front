import React, { useEffect, useState } from "react";
import api from "../api/axiosVenta";

const DetalleVentaList = () => {
    const [detalleVentas, setDetalleVentas] = useState([]);

    const cargarDetalleVentas = async () => {
        const res = await api.get("/detalle-ventas");
        console.log(res.data); // para debug
        setDetalleVentas(res.data);
    };

    useEffect(() => {
        cargarDetalleVentas();
    }, []);

    return (
        <div className="empleado-list">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Id Empleado</th>
                        <th>Nombre Empleado</th>
                        <th>Productos vendidos</th>
                        <th>Fecha</th>
                        <th>Total Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {detalleVentas.map((venta) => {
                        // Parseamos el JSON para obtener el array de productos
                        let productos = [];
                        try {
                            productos = JSON.parse(venta.productosJson);
                        } catch (error) {
                            console.error("Error parsing productos_json", error);
                        }

                        return (
                            <tr key={venta.id}>
                                <td>{venta.id}</td>
                                <td>{venta.empleadoId}</td>
                                <td>{venta.empleadoNombre}</td>
                                <td>
                                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                        {productos.map((prod, index) => (
                                            <li key={index}>
                                                {prod.nombre} - Cantidad: {prod.cantidad} - Precio: ${prod.precioUnitario}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{new Date(venta.fecha).toLocaleString()}</td>
                                <td>
                                    {venta.ventaTotal !== undefined && venta.ventaTotal !== null
                                        ? `$${Number(venta.ventaTotal).toFixed(2)}`
                                        : "$0.00"}
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DetalleVentaList;
