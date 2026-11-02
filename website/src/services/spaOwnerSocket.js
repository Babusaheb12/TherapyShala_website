import { io } from 'socket.io-client';

const PROD_SOCKET_URL = 'https://api.therapyshala.com/spa-owner';
const DEV_SOCKET_URL = 'https://yiddish-darkened-absolute.ngrok-free.dev/spa-owner';

const DEFAULT_SOCKET_URL =
  import.meta.env.PROD
    ? PROD_SOCKET_URL
    : import.meta.env.VITE_SOCKET_URL || DEV_SOCKET_URL;

// Derive the socket URL matching the current API host or environment variable
export const getSpaOwnerSocketUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.trim();
  }

  const rawBase =
    (import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL) ||
    (import.meta.env.PROD
      ? 'https://api.therapyshala.com/api/v1/'
      : 'https://yiddish-darkened-absolute.ngrok-free.dev/api/v1/');

  try {
    const origin = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
    return `${origin}/spa-owner`;
  } catch {
    return DEFAULT_SOCKET_URL;
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
    notification?._id ||
    notification?.appointmentId ||
    notification?.bookingId;

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

  currentToken = token;
  const socketUrl = getSpaOwnerSocketUrl();

  console.log('[SpaOwnerSocket] Connecting to:', socketUrl);

  socketInstance = io(socketUrl, {
    path: '/socket.io',
    transports: ['websocket'],
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

  // 1. Initial connection & reconnect listener (Separate from event handlers)
  socketInstance.on('connect', () => {
    console.log('[SpaOwnerSocket] Connected successfully (socket id):', socketInstance.id);
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
    console.log('[SpaOwnerSocket] Realtime appointment:new event received:', notification);
    dispatchNotification(notification, 'appointment:new');
  });

  socketInstance.on('support:reply', (notification) => {
    console.log('[SpaOwnerSocket] Realtime support:reply event received:', notification);
    dispatchNotification(notification, 'support:reply');
  });

  socketInstance.on('owner:notification', (notification) => {
    console.log('[SpaOwnerSocket] Realtime owner:notification event received:', notification);
    dispatchNotification(notification, 'owner:notification');
  });

  socketInstance.on('socket:ready', (details) => {
    console.log('[SpaOwnerSocket] Namespace ready:', details);
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
    console.error('Owner socket error:', error?.message || error);
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
