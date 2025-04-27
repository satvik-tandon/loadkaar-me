import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001/api" });

export const db = () => API.get("/");
export const fetchUsers = () => API.get("/users");
