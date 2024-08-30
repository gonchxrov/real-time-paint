export class Socket {
  public static sendMessage(socket: WebSocket, message: object) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  public static sendDrawMessage(socket: WebSocket, id: string, type: string, data: object = {}) {
    const message = {
      method: 'draw',
      id,
      figure: {
        type,
        ...data
      }
    };

    Socket.sendMessage(socket, message);
  }
}