import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const loginAdminApi = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  // backend trả: { token, user: {...} }
  const { token, user } = res.data;

  // LƯU RAW TOKEN, KHÔNG thêm "Bearer "
  localStorage.setItem("sf_token", token);
  localStorage.setItem("sf_user", JSON.stringify(user));

  return { token, user };
};
