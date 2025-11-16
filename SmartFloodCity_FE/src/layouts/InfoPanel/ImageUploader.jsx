// src/components/report/ImageUploader.jsx
import { useState, useEffect } from "react";
import { IoImagesOutline, IoClose } from "react-icons/io5";
import { uploadImages } from "../../services/uploadService";
import "./InfoPanel.css";

export default function ImageUploader({ imageUrls = [], onChange = () => {} }) {
  const [localPreview, setLocalPreview] = useState(imageUrls);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalPreview(imageUrls || []);
  }, [imageUrls]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    console.log("Files chọn từ input:", files);

    try {
      setUploading(true);

      const uploadedUrls = await uploadImages(files);
      console.log("Uploaded URLs:", uploadedUrls);

      const newUrls = [...localPreview, ...uploadedUrls];
      setLocalPreview(newUrls);
      onChange(newUrls);
    } catch (err) {
      console.error("Upload ảnh lỗi:", err);

      let message = "Upload ảnh thất bại, vui lòng thử lại.";

      // Nếu backend có trả JSON { message: "..."}
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      // Nếu backend trả text (HTML 404, text lỗi...)
      else if (typeof err.response?.data === "string") {
        message = `Lỗi ${err.response.status}: ${err.response.data}`;
      }
      // Nếu có status mà không có data
      else if (err.response?.status) {
        message = `Lỗi ${err.response.status}`;
      } else if (err.message) {
        message = err.message;
      }

      alert(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (index) => {
    const updated = localPreview.filter((_, i) => i !== index);
    setLocalPreview(updated);
    onChange(updated);
  };

  return (
    <div className="form-group">
      <label className="block font-medium mb-1">Hình ảnh hiện trường</label>

      <div className="upload-box">
        <div className="upload-icon">
          <IoImagesOutline />
        </div>
        <p>
          Chọn ảnh từ thiết bị (ảnh sẽ được tải lên máy chủ ngay sau khi chọn)
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="upload-input"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <p className="text-xs text-blue-500 mt-1">
          Đang tải ảnh lên máy chủ...
        </p>
      )}

      {!!localPreview.length && (
        <div className="preview-container">
          {localPreview.map((src, index) => (
            <div key={src + index} className="preview-image-box">
              <img src={src} alt={`preview-${index}`} className="preview-image" />
              <button
                type="button"
                className="preview-remove-btn"
                onClick={() => handleRemove(index)}
              >
                <IoClose />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
