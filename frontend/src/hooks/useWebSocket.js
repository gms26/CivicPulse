import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './useAuth';

export const useWebSocket = (onMessageReceived) => {
  const { token, user } = useAuth();
  const clientRef = useRef(null);

  useEffect(() => {
    if (!token || !user) return;

    // Use absolute URL for SockJS based on environment
    const socketUrl = import.meta.env.VITE_WS_URL 
      ? `${import.meta.env.VITE_WS_URL}/ws` 
      : 'http://localhost:8080/ws';
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      console.log('STOMP Connected');
      client.subscribe('/user/queue/notifications', (message) => {
        if (message.body && onMessageReceived) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [token, user, onMessageReceived]);

  return clientRef.current;
};
