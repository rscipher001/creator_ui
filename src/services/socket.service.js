import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = io(process.env.VUE_APP_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }
}

export default new SocketService();
