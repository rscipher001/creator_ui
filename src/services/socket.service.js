import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }
}

export default new SocketService();
