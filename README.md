# 🌊 Urban Flood Open Data Platform

Ứng dụng phân tích và dự báo tình trạng ngập đô thị dựa trên dữ liệu mở và phản ánh cộng đồng.

## 🧩 Mục tiêu
- Thu thập dữ liệu cảm biến, thời tiết, và phản ánh của người dân.
- Chuẩn hóa dữ liệu theo chuẩn **SOSA/SSN** và **NGSI-LD**.
- Lưu trữ và truy vấn bằng **Apache Jena Fuseki (RDF store)**.
- Cung cấp API mở cho nhà phát triển và cơ quan quản lý.
- Giao diện web giúp người dân xem bản đồ ngập và gửi phản ánh.

## 🛠️ Công nghệ chính
- **Backend:** Node.js (Express)
- **Frontend:** React (Vite)
- **Database:** Apache Jena Fuseki (RDF Triple Store)
- **Data Standards:** NGSI-LD, SOSA/SSN Ontology
- **Deployment:** Docker Compose

## 🚀 Cách chạy nhanh
```bash
git clone https://github.com/yourname/urban-flood-open-data-platform.git
cd urban-flood-open-data-platform
cp .env.example .env
docker-compose up --build
