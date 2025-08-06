import axios from "axios";

const loginApi = axios.create({
  baseURL: "https://localhost:8085/api",
});

export default loginApi;
