// export hàm khởi tạo
import { Server } from 'socket.io';

const initSocket = (server, corsOrigin='*') => {
  const io = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET','POST'] },
    transports: ['websocket','polling'],
  });

  const nsp = io.of('/reports');
  nsp.on('connection', (socket) => {
    socket.on('subscribe:approved', () => socket.join('approved'));
  });

  return io;
};

export default initSocket;
