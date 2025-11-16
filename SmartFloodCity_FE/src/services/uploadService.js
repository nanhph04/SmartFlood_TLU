// src/services/uploadService.js
import axios from "axios";

// 1. PORT & host của backend
const API_BASE_URL = "http://localhost:3000";

// 2. ĐƯỜNG DẪN UPLOAD ĐÚNG Y NHƯ POSTMAN (phần sau :3000)
const UPLOAD_PATH = "/api/uploads"; // ví dụ: "/api/upload", "/api/report/upload-image", ...

// 3. TÊN FIELD FILE ĐÚNG Y NHƯ POSTMAN / multer
const FILE_FIELD_NAME = "images";   // ví dụ: "image", "file", "images", ...

export const uploadImages = async (files) => {
  const formData = new FormData();

  // Nếu backend dùng .array("images") thì cứ append nhiều lần cùng tên "images"
  files.forEach((file) => {
    formData.append(FILE_FIELD_NAME, file);
  });

  try {
    const res = await axios.post(`${API_BASE_URL}${UPLOAD_PATH}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", res.data);

    // Tùy format backend trả về, xử lý 3 kiểu phổ biến:
    if (Array.isArray(res.data?.urls)) {
      return res.data.urls;                 // { urls: ["...","..."] }
    }

    if (res.data?.url) {
      return [res.data.url];                // { url: "..." }
    }

    if (Array.isArray(res.data)) {
      return res.data;                      // ["...","..."]
    }

    throw new Error("Định dạng response upload không đúng như mong đợi");
  } catch (error) {
    console.error(
      "Upload error:",
      error?.response?.status,
      error?.response?.data
    );
    throw error;
  }
};
