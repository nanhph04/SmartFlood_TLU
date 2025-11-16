import axios from "axios";
/**
 * Gọi Nominatim để geocode address -> city, district, ward, coordinates (lat, lon)
 * @param {string} address
 */
export const  geocodeService = async (address) => {
  if (!address || typeof address !== "string") {
    throw new Error("Địa chỉ không hợp lệ");
  }

  try {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          // nhớ sửa email này thành email của bạn
          "User-Agent":
            "smart-flood-system/1.0 (congxuanduy2004@gmail.com)",
        },
      }
    );

    const results = res.data;

    if (!results || results.length === 0) {
      throw new Error("Không tìm thấy toạ độ cho địa chỉ này");
    }

    const best = results[0];
    const lat = parseFloat(best.lat);
    const lon = parseFloat(best.lon);
    const addr = best.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.state ||
      "Không rõ thành phố";

    const district = addr.city_district || addr.county || "";
    const ward = addr.suburb || addr.neighbourhood || "";

    return {
      city,
      district,
      ward,
      location: {
        type: "Point",
        coordinates: [lon, lat], // GeoJSON: [lng, lat]
      },
    };
  } catch (err) {
    // log ra console để debug
    console.error("Error when calling Nominatim:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    throw err; // ném lên cho controller xử lý
  }
}
