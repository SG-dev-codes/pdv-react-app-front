import React, { useState } from "react";
import Login from "./Login";
import Register from "./Registrar";
import "./VistaLogin.css";

const VistaLogin = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      {showLogin ? (
        <>
          <div className="auth-box">
            <Login onLoginSuccess={onLoginSuccess} />
            <p className="auth-switch">
              ¿No tienes cuenta?{" "}
              <button
                className="switch-btn"
                onClick={() => setShowLogin(false)}
                type="button"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="auth-box">
            <Register onRegisterSuccess={() => setShowLogin(true)} />
            <p className="auth-switch">
              ¿Ya tienes cuenta?{" "}
              <button
                className="switch-btn"
                onClick={() => setShowLogin(true)}
                type="button"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VistaLogin;
