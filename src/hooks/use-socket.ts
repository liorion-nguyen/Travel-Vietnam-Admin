import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { type Notification } from '@/types/notification';
import { envConfig } from '@/config';

export const useSocket = (): {
  socket: Socket | null;
  notifications: Notification[];
} => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newSocket = io(envConfig.socketURL);
    setSocket(newSocket);

    newSocket.on('notification', (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, notifications };
};
