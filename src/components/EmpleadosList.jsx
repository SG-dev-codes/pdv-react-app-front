import React, { useEffect, useState } from "react";
import api from "../api/axiosLogin";

const EmpleadosList = ({ onEditar }) => {
    const [empleados, setEmpleados] = useState([]);
    const [orden, setOrden] = useState({ columna: null, direccion: "asc" });

    const cargarEmpleados = async () => {
        const res = await api.get("/empleados");
        setEmpleados(res.data);
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

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

    const empleadosOrdenados = [...empleados].sort(comparar);

    const flechaOrden = (columna) => {
        if (orden.columna !== columna) return null;
        return (
            <span style={{ marginLeft: "5px", color: "#0c0f13ff", fontWeight: "bold" }}>
                {orden.direccion === "asc" ? "▲" : "▼"}
            </span>
        );
    };

    return (
        <div className="empleado-list">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => cambiarOrden("idempleado")}>
                            Id Empleado{flechaOrden("idempleado")}
                        </th>
                        <th onClick={() => cambiarOrden("nombre")}>
                            Nombre{flechaOrden("nombre")}
                        </th>
                        <th onClick={() => cambiarOrden("apellido_paterno")}>
                            Apellido Paterno{flechaOrden("apellido_paterno")}
                        </th>
                        <th onClick={() => cambiarOrden("apellido_materno")}>
                            Apellido Materno{flechaOrden("apellido_materno")}
                        </th>
                        <th onClick={() => cambiarOrden("correo")}>
                            Correo{flechaOrden("correo")}
                        </th>
                        <th onClick={() => cambiarOrden("rol")}>
                            Rol{flechaOrden("rol")}
                        </th>
                        <th onClick={() => cambiarOrden("hora_entrada")}>
                            Hora de entrada{flechaOrden("hora_entrada")}
                        </th>
                        <th onClick={() => cambiarOrden("hora_salida")}>
                            Hora de salida{flechaOrden("hora_salida")}
                        </th>
                        <th onClick={() => cambiarOrden("dias_laborales")}>
                            Días Laborales{flechaOrden("dias_laborales")}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosOrdenados.map((p) => (
                        <tr key={p.idempleado}>
                            <td>{p.idempleado}</td>
                            <td>{p.nombre}</td>
                            <td>{p.apellido_paterno}</td>
                            <td>{p.apellido_materno}</td>
                            <td>{p.correo}</td>
                            <td>{p.rol}</td>
                            <td>{p.hora_entrada}</td>
                            <td>{p.hora_salida}</td>
                            <td>{p.dias_laborales}</td>
                            <td>
                                <button onClick={() => onEditar(p)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmpleadosList;
