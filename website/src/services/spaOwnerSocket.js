import { io } from 'socket.io-client';

const PROD_SOCKET_URL = 'https://api.therapyshala.com/spa-owner';

// REST API prefixes are not part of the owner socket namespace.
export const getSpaOwnerSocketUrl = () => {
  const configuredUrl = import.meta.env.DEV && import.meta.env.VITE_SOCKET_URL?.trim();
  const apiBase = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL?.trim();
  try {
    const url = new URL(configuredUrl || apiBase || PROD_SOCKET_URL);
    url.pathname = url.pathname.replace(/^\/api\/v1(?=\/|$)/, '').replace(/\/+$/, '');
    if (!configuredUrl || !url.pathname) url.pathname = '/spa-owner';
    return url.toString().replace(/\/+$/, '');
  } catch {
    return PROD_SOCKET_URL;
  }
};

let socketInstance = null;
let currentToken = null;
const seenNotificationIds = new Set();

// Event callback sets
const eventListeners = {
  appointmentNew: new Set(),
  notification: new Set(),
  ready: new Set(),
  connect: new Set(),
  connectError: new Set(),
  disconnect: new Set(),
};

const dispatchNotification = (notification, eventName) => {
  const notifId =
    notification?.id ||
    notification?.notificationId ||
    notification?.data?.notificationId ||
    notification?._id;

  if (notifId && seenNotificationIds.has(String(notifId))) {
    console.warn('[SpaOwnerSocket] Skipped duplicate notification:', notifId);
    return;
  }

  if (notifId) {
    seenNotificationIds.add(String(notifId));
    if (seenNotificationIds.size > 200) {
      const first = seenNotificationIds.values().next().value;
      seenNotificationIds.delete(first);
    }
  }

  eventListeners.notification.forEach((fn) => {
    try {
      fn(notification, eventName);
    } catch (err) {
      console.error('[SpaOwnerSocket] Error in notification listener:', err);
    }
  });

  if (eventName === 'appointment:new') {
    eventListeners.appointmentNew.forEach((fn) => {
      try {
        fn(notification);
      } catch (err) {
        console.error('[SpaOwnerSocket] Error in appointment listener:', err);
      }
    });
  }
};

/**
 * Initialize or reuse the singleton Spa Owner Socket connection.
 * Guarantees a single persistent connection across component renders.
 *
 * @param {string} token - Spa Owner JWT Bearer token
 * @returns {Socket}
 */
export const connectSpaOwnerSocket = (token) => {
  if (!token) {
    disconnectSpaOwnerSocket();
    return null;
  }

  // If socket is already active with the same token, reuse instance without reconnecting
  if (socketInstance && currentToken === token) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  // Token has changed or socket doesn't exist yet -> teardown previous
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  seenNotificationIds.clear();
  currentToken = token;
  const socketUrl = getSpaOwnerSocketUrl();

  console.log('[SpaOwnerSocket] Connecting to:', socketUrl);

  socketInstance = io(socketUrl, {
    path: '/socket.io',
    transports: ['polling', 'websocket'],
    auth: {
      token: token,
    },
    extraHeaders: {
      'ngrok-skip-browser-warning': '1',
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  const socket = socketInstance;
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  socket.io.on('reconnect_attempt', (attempt) => {
    console.info('[SpaOwnerSocket] Reconnect attempt:', attempt);
  });
  socket.io.on('reconnect_failed', () => {
    console.error('[SpaOwnerSocket] Reconnect failed');
  });

  // Log event names only, so production delivery can be checked without exposing message data.
  socketInstance.onAny((eventName) => {
    const handledEvents = ['appointment:new', 'support:reply', 'owner:notification', 'socket:ready', 'socket:diagnostic'];
    console.info('[SpaOwnerSocket] Incoming event:', eventName);
    if (!handledEvents.includes(eventName)) {
      console.warn('[SpaOwnerSocket] No owner notification handler for event:', eventName);
    }
  });

  // 1. Initial connection & reconnect listener (Separate from event handlers)
  socketInstance.on('connect', () => {
    const engine = socket.io.engine;
    console.info('[SpaOwnerSocket] Connected', {
      socketId: socket.id, origin, namespace: socket.nsp, transport: engine?.transport?.name,
    });
    engine?.once('upgrade', (transport) => {
      console.info('[SpaOwnerSocket] Transport upgraded:', transport.name);
    });
    socket.timeout(5000).emit('socket:diagnostic', (error, response) => {
      // Ignore acknowledgements belonging to a disconnected/replaced session.
      if (socketInstance !== socket || !socket.connected) return;
      const data = response?.data;
      console.info('[SpaOwnerSocket] Diagnostic', {
        timeout: Boolean(error), success: response?.success, code: response?.error?.code,
        connected: data?.connected, ownerRoomJoined: data?.ownerRoomJoined,
        namespace: data?.namespace, transport: data?.transport,
        socketId: data?.socketId, processId: data?.processId, serverTime: data?.serverTime,
      });
    });
    eventListeners.connect.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('[SpaOwnerSocket] Error in connect listener:', err);
      }
    });
  });

  // 2. Realtime Appointment Booking Notification (Registered strictly outside connect)
  socketInstance.on('appointment:new', (notification) => {
    console.info('[SpaOwnerSocket] appointment:new received:', { id: notification?.id, type: notification?.type });
    dispatchNotification(notification, 'appointment:new');
  });

  socketInstance.on('support:reply', (notification) => {
    console.info('[SpaOwnerSocket] support:reply received:', { id: notification?.id, type: notification?.type });
    dispatchNotification(notification, 'support:reply');
  });

  socketInstance.on('owner:notification', (notification) => {
    console.info('[SpaOwnerSocket] owner:notification received:', { id: notification?.id, type: notification?.type });
    dispatchNotification(notification, 'owner:notification');
  });

  socketInstance.on('socket:ready', (details) => {
    console.info('[SpaOwnerSocket] Namespace ready:', { namespace: details?.namespace, role: details?.role, socketId: details?.socketId });
    eventListeners.ready.forEach((fn) => {
      try {
        fn(details);
      } catch (err) {
        console.error('[SpaOwnerSocket] Error in ready listener:', err);
      }
    });
  });

  // 3. Connect error listener
  socketInstance.on('connect_error', (error) => {
    console.error('[SpaOwnerSocket] connect_error', {
      message: error?.message, code: error?.data?.code,
      namespace: error?.data?.namespace || socket.nsp, origin,
    });
    eventListeners.connectError.forEach((fn) => {
      try {
        fn(error);
      } catch (err) {
        console.error('[SpaOwnerSocket] Error in connect_error listener:', err);
      }
    });
  });

  // 4. Disconnect listener
  socketInstance.on('disconnect', (reason) => {
    console.log('[SpaOwnerSocket] Disconnected:', reason);
    eventListeners.disconnect.forEach((fn) => {
      try {
        fn(reason);
      } catch (err) {
        console.error('[SpaOwnerSocket] Error in disconnect listener:', err);
      }
    });
  });

  return socketInstance;
};

/**
 * Disconnect and cleanup singleton socket instance (e.g. upon owner logout)
 */
export const disconnectSpaOwnerSocket = () => {
  if (socketInstance) {
    console.log('[SpaOwnerSocket] Disconnecting socket instance on logout/teardown');
    socketInstance.disconnect();
    socketInstance = null;
  }
  currentToken = null;
  seenNotificationIds.clear();
};

/**
 * Subscribe to appointment:new realtime events
 *
 * @param {Function} callback - (notification) => void
 * @returns {Function} unsubscribe
 */
export const onNewAppointmentNotification = (callback) => {
  eventListeners.appointmentNew.add(callback);
  return () => {
    eventListeners.appointmentNew.delete(callback);
  };
};

export const onSpaOwnerNotification = (callback) => {
  eventListeners.notification.add(callback);
  return () => {
    eventListeners.notification.delete(callback);
  };
};

export const onSpaOwnerSocketReady = (callback) => {
  eventListeners.ready.add(callback);
  return () => {
    eventListeners.ready.delete(callback);
  };
};

/**
 * Subscribe to connect / reconnect events
 *
 * @param {Function} callback - () => void
 * @returns {Function} unsubscribe
 */
export const onSocketConnect = (callback) => {
  eventListeners.connect.add(callback);
  return () => {
    eventListeners.connect.delete(callback);
  };
};

/**
 * Subscribe to socket connection error events
 *
 * @param {Function} callback - (error) => void
 * @returns {Function} unsubscribe
 */
export const onSocketConnectError = (callback) => {
  eventListeners.connectError.add(callback);
  return () => {
    eventListeners.connectError.delete(callback);
  };
};

export const onSocketDisconnect = (callback) => {
  eventListeners.disconnect.add(callback);
  return () => {
    eventListeners.disconnect.delete(callback);
  };
};

/**
 * Retrieve current active socket instance if available
 */
export const getSpaOwnerSocket = () => socketInstance;

export default {
  connectSpaOwnerSocket,
  disconnectSpaOwnerSocket,
  onNewAppointmentNotification,
  onSpaOwnerNotification,
  onSpaOwnerSocketReady,
  onSocketConnect,
  onSocketConnectError,
  onSocketDisconnect,
  getSpaOwnerSocket,
};
