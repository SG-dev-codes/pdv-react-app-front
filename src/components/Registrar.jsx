import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosLogin";
import Swal from "sweetalert2";

const Registrar = ({ empleadoEditado, onEmpleadoGuardado, onCancelar }) => {
  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contrasena: "",
    rol: "",
    hora_entrada: "",
    hora_salida: "",
    dias_laborales: "",
  });

  const formularioRef = useRef(null);

  // Cargar datos si se está editando
  useEffect(() => {
    if (empleadoEditado) {
      setEmpleado(empleadoEditado);
    }
  }, [empleadoEditado]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (empleado.idempleado) {
        await api.put(`/actualizar/${empleado.idempleado}`, empleado);
        Swal.fire({
          icon: "success",
          title: "Actualización exitosa",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/registrar", empleado);
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      onEmpleadoGuardado();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || "Algo salió mal",
      });
    }
  };

  return (
    <form className="login-form" ref={formularioRef} onSubmit={handleSubmit}>
      <h2 className="login-title">
        {empleadoEditado ? "Editar Usuario" : "Registrar"}
      </h2>
      <input
        name="nombre"
        placeholder="Nombre"
        value={empleado.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="apellido_paterno"
        placeholder="Apellido Paterno"
        value={empleado.apellido_paterno}
        onChange={handleChange}
        required
      />
      <input
        name="apellido_materno"
        placeholder="Apellido Materno"
        value={empleado.apellido_materno}
        onChange={handleChange}
        required
      />
      <input
        name="correo"
        type="email"
        placeholder="Correo"
        value={empleado.correo}
        onChange={handleChange}
        required
      />
      <input
        name="contrasena"
        type="password"
        placeholder="Contraseña"
        value={empleado.contrasena}
        onChange={handleChange}
        required={!empleadoEditado} // No requerida al editar
      />
      <select
        name="rol"
        value={empleado.rol}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Selecciona un rol
        </option>
        <option value="admin">Admin</option>
        <option value="empleado">Empleado</option>
      </select>
      <input
        name="hora_entrada"
        type="text"
        value={empleado.hora_entrada}
        onChange={handleChange}
        required

      />
      <input
        name="hora_salida"
        type="text"
        value={empleado.hora_salida}
        onChange={handleChange}
        required

      />
      <input
        name="dias_laborales"
        type="text"
        placeholder="Días Laborales"
        value={empleado.dias_laborales}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {empleadoEditado ? "Actualizar" : "Registrar"}
      </button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  );
};

export default Registrar;
