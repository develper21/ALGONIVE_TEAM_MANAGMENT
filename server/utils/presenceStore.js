const userSockets = new Map();

export const setUserOnline = (userId, socketId) => {
  const id = userId.toString();
  const sockets = userSockets.get(id) || new Set();
  sockets.add(socketId);
  userSockets.set(id, sockets);
  return sockets.size;
};

export const setUserOffline = (userId, socketId) => {
  const id = userId.toString();
  const sockets = userSockets.get(id);
  if (!sockets) {
    return 0;
  }

  sockets.delete(socketId);
  if (sockets.size === 0) {
    userSockets.delete(id);
    return 0;
  }

  return sockets.size;
};

export const getOnlineUserIds = () => Array.from(userSockets.keys());
