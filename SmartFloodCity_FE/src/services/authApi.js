import apiClient from "./apiClient";

export async function loginAdminApi(email, password) {
  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });
  
  return res.data;
}