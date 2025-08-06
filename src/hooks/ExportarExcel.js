import api from "../api/axiosConfig";

export function useExportarExcel(endpoint = "/ventas/excel", nombreArchivo = "ventas.xlsx") {
    const exportar = () => {
        const link = document.createElement("a");
        link.href = `${api.defaults.baseURL}${endpoint}`;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { exportar };
}
