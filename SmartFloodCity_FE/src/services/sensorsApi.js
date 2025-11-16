// src/services/sensorsApi.js
import apiClient from "./apiClient";

export const getSensors = () => apiClient.get("/sensors");
export const createSensor = (data) => apiClient.post("/sensors", data);
export const updateSensor = (id, data) => apiClient.patch(`/sensors/${id}`, data);
export const deleteSensor = (id) => apiClient.delete(`/sensors/${id}`);
