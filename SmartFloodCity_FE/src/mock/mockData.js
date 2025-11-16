export const kpiCards = {
  totalSensors: {
    title: "Tổng cảm biến",
    total: 6,
    danger: 2,
    warning: 1,
  },
  pendingReports: {
    title: "Báo cáo chờ xử lý",
    total: 1,
    note: "Cần xác minh",
  },
  verifiedReports: {
    title: "Đã xác minh",
    total: 3,
    note: "Báo cáo hợp lệ",
  },
  criticalLocations: {
    title: "Vị trí nghiêm trọng",
    total: 1,
    note: "Cần ưu tiên xử lý",
  },
};

export const sensors = [
  {
    id: 1,
    name: "Cảm biến Nguyễn Huệ",
    location: "Đường Nguyễn Huệ, Quận 1",
    waterLevel: 43.4,
    capacity: 100,
    status: "normal",
    updatedAt: "vừa xong",
  },
  {
    id: 2,
    name: "Cảm biến Lê Lợi",
    location: "Đường Lê Lợi, Quận 1",
    waterLevel: 73.0,
    capacity: 100,
    status: "danger",
    updatedAt: "vừa xong",
  },
  {
    id: 3,
    name: "Cảm biến Lý Tự Trọng",
    location: "Đường Lý Tự Trọng, Quận 1",
    waterLevel: 88.6,
    capacity: 100,
    status: "danger",
    updatedAt: "vừa xong",
  },
  {
    id: 4,
    name: "Cảm biến Nguyễn Thị Minh Khai",
    location: "Đường Nguyễn Thị Minh Khai, Quận 3",
    waterLevel: 30.9,
    capacity: 100,
    status: "normal",
    updatedAt: "vừa xong",
  },
  {
    id: 5,
    name: "Cảm biến Cách Mạng Tháng 8",
    location: "Đường Cách Mạng Tháng 8, Quận 10",
    waterLevel: 66.5,
    capacity: 100,
    status: "warning",
    updatedAt: "vừa xong",
  },
  {
    id: 6,
    name: "Cảm biến Võ Văn Tần",
    location: "Đường Võ Văn Tần, Quận 3",
    waterLevel: 26.5,
    capacity: 100,
    status: "normal",
    updatedAt: "vừa xong",
  },
];

export const sensorStatusSummary = [
  { type: "normal", label: "Bình thường", count: 3 },
  { type: "warning", label: "Cảnh báo", count: 1 },
  { type: "danger", label: "Nguy hiểm", count: 2 },
];

export const recentActivities = [
  {
    id: 1,
    type: "sensor",
    text: "Cảm biến Lý Tự Trọng cập nhật trạng thái nguy hiểm",
    timeAgo: "2 phút trước",
  },
  {
    id: 2,
    type: "verify",
    text: "Xác minh báo cáo ngập tại Nguyễn Huệ - Lê Lợi",
    timeAgo: "5 phút trước",
  },
  {
    id: 3,
    type: "report",
    text: "Nhận báo cáo mới từ người dân tại Quận 3",
    timeAgo: "8 phút trước",
  },
];

export const pendingReports = [
  {
    id: 1,
    location: "Đường Cách Mạng Tháng 8, Quận 10",
    description: "Ngập nhẹ, giao thông chậm",
    level: "Nhẹ",
    reporter: "Lê Văn C",
    timeAgo: "15 phút trước",
  },
];

export const verifiedReports = [
  {
    id: 2,
    location: "Ngã tư Nguyễn Huệ - Lê Lợi",
    description: "Nước ngập cao khoảng 30cm, xe máy khó di chuyển",
    level: "Trung bình",
    reporter: "Nguyễn Văn A",
    timeAgo: "10 phút trước",
    status: "Đã xác minh",
  },
  {
    id: 3,
    location: "Đường Lý Tự Trọng gần công viên 30/4",
    description: "Ngập nặng, ô tô không thể đi qua. Nước tràn vào nhà dân.",
    level: "Nghiêm trọng",
    reporter: "Trần Thị B",
    timeAgo: "5 phút trước",
    status: "Đã xác minh",
  },
  {
    id: 4,
    location: "Đường Nguyễn Thị Minh Khai, Quận 3",
    description: "Hệ thống thoát nước bị tắc, nước bắt đầu dâng cao",
    level: "Trung bình",
    reporter: "Phạm Thị D",
    timeAgo: "8 phút trước",
    status: "Đã xác minh",
  },
];
