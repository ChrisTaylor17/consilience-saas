import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server (replace with your AWS API Gateway WebSocket URL)
    const socketConnection = io(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketConnection.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketConnection.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return socket;
};