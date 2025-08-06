import axios from "axios";

const ventaApi = axios.create({
    baseURL: "https://localhost:8084/ventas",
});

export default ventaApi;