import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './useAuth';

export const useWebSocket = (onMessageReceived) => {
  const { token, user } = useAuth();
  const clientRef = useRef(null);

  // Keep the latest callback in a ref so the connection effect only depends
  // on auth state. Callers pass inline callbacks; depending on the callback
  // itself would tear down and reconnect the STOMP client on every render.
  const callbackRef = useRef(onMessageReceived);
  useEffect(() => {
    callbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!token || !user) return;

    // Use absolute URL for SockJS based on environment
    let socketUrl = import.meta.env.VITE_WS_URL
      ? `${import.meta.env.VITE_WS_URL}/ws`
      : 'http://localhost:8080/ws';

    // SockJS requires HTTP/HTTPS protocols (it upgrades to WS internally)
    socketUrl = socketUrl.replace(/^ws:\/\//i, 'http://').replace(/^wss:\/\//i, 'https://');

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      client.subscribe('/user/queue/notifications', (message) => {
        if (message.body && callbackRef.current) {
          callbackRef.current(JSON.parse(message.body));
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
      client.deactivate();
      clientRef.current = null;
    };
  }, [token, user]);
};
