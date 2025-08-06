import React, { useState } from "react";
import api from "../api/axiosLogin";
import Swal from "sweetalert2";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/iniciar-sesion", { correo, contrasena });
      Swal.fire({
        icon: "success",
        title: `Bienvenido ${res.data.empleado.nombre}`,
        timer: 1500,
        showConfirmButton: false,
      });
      onLoginSuccess(res.data.empleado);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || "Credenciales incorrectas",
      });
    }
  };

  return (


    <form className="login-form" onSubmit={handleSubmit}>
     <h2 className="login-title">Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default Login;
