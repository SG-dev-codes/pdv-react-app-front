import React from "react";
import { useExportarExcel } from "../hooks/ExportarExcel";
import "./ExportarExcel.css";

function BotonExportarExcel() {
    const { exportar } = useExportarExcel(); // usa valores por defecto

    return (
        <div className="contenedor-exportar">
            <button className="btn-exportar" onClick={exportar}>
                Exportar a Excel
            </button>
        </div>
    );
}

export default BotonExportarExcel;
