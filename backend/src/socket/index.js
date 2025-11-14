import { Server } from 'socket.io';
import http from 'http';

// Hàm khởi tạo server HTTP và socket.io, hỗ trợ namespace và room
export function setupSocket(app, corsOrigin = '*') {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  // Namespace mặc định
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });

  // Namespace riêng cho report
  const nsp = io.of('/reports');
  nsp.on('connection', (socket) => {
    socket.on('subscribe:approved', () => socket.join('approved'));
  });

  return { io, server };
}
