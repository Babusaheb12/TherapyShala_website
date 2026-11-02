import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Clock3,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  UserRound,
} from 'lucide-react';
import { API_BASE_URL } from '../../services/apiClient';
import {
  getSpaOwnerChatConversation,
  getSpaOwnerChatConversations,
  getSpaOwnerChatMessages,
  sendSpaOwnerChatMessage,
} from '../../services/spaOwnerChat.service';
import { resolveMediaUrl } from '../../utils/mediaUtils';

const unwrapData = (response) => response?.data?.data ?? response?.data ?? response;

const getCursor = (response) =>
  response?.meta?.nextCursor ??
  response?.nextCursor ??
  response?.data?.meta?.nextCursor ??
  response?.data?.nextCursor ??
  response?.data?.pagination?.nextCursor ??
  null;

const getConversationId = (conversation) =>
  conversation?.id ||
  conversation?._id ||
  conversation?.publicId ||
  conversation?.conversationId ||
  '';

const getMessageId = (message) =>
  message?.id ||
  message?._id ||
  message?.publicId ||
  message?.messageId ||
  message?.uuid ||
  message?.clientMessageId ||
  '';

const getConversationMessages = (response) => {
  const queue = [response];
  const visited = new Set();
  while (queue.length) {
    const value = queue.shift();
    if (!value || typeof value !== 'object' || visited.has(value)) continue;
    visited.add(value);
    if (Array.isArray(value)) return value;
    for (const key of [
      'messages',
      'messageHistory',
      'history',
      'items',
      'results',
      'rows',
      'docs',
    ]) {
      if (Array.isArray(value[key])) return value[key];
      if (value[key] && typeof value[key] === 'object') queue.push(value[key]);
    }
    for (const key of ['data', 'conversation', 'result', 'payload']) {
      if (value[key] && typeof value[key] === 'object') queue.push(value[key]);
    }
  }
  return [];
};

const normalizeMessage = (message = {}) => {
  const role = String(
    message.senderRole ||
      message.senderType ||
    (typeof message.sender === 'string'
      ? message.sender
      : message.sender?.role || message.sender?.type) ||
    message.role ||
      ''
  ).toUpperCase();
  const text = String(
    message.text ?? message.content ?? message.body ?? message.message ?? ''
  );
  const createdAt = message.createdAt || message.sentAt || message.timestamp || null;
  const id =
    getMessageId(message) ||
    message.__fallbackId ||
    `${createdAt || 'unknown'}:${role || 'unknown'}:${text}`;
  const owner =
    message.isMine === true ||
    message.isOwner === true ||
    ['SPA_OWNER', 'OWNER', 'SPA'].includes(role);
  return {
    ...message,
    id,
    text,
    createdAt,
    owner,
    read:
      Boolean(message.readAt || message.recipientReadAt || message.isRead) ||
      String(message.status || '').toUpperCase() === 'READ',
    clientMessageId: message.clientMessageId || null,
  };
};

const normalizeConversation = (conversation = {}) => {
  const customer =
    conversation.customer ||
    conversation.client ||
    conversation.participant ||
    conversation.user ||
    {};
  const lastMessage =
    conversation.lastMessage ||
    conversation.latestMessage ||
    conversation.last_message ||
    {};
  const booking =
    conversation.booking ||
    conversation.bookingContext ||
    conversation.latestBooking ||
    null;

  return {
    ...conversation,
    id: getConversationId(conversation),
    customerName:
      customer.fullName ||
      customer.name ||
      conversation.customerName ||
      conversation.clientName ||
      'Customer',
    customerAvatar:
      customer.avatarUrl ||
      customer.profileImageUrl ||
      customer.avatar ||
      conversation.customerAvatarUrl ||
      null,
    lastMessageText:
      typeof lastMessage === 'string'
        ? lastMessage
        : lastMessage.text ||
          lastMessage.content ||
          lastMessage.body ||
          lastMessage.message ||
          lastMessage.preview ||
          conversation.lastMessageText ||
          '',
    lastMessageAt:
      (typeof lastMessage === 'object' && lastMessage.createdAt) ||
      conversation.lastMessageAt ||
      conversation.updatedAt ||
      conversation.createdAt ||
      null,
    lastMessage:
      typeof lastMessage === 'object' && lastMessage
        ? lastMessage
        : conversation.lastMessageText
          ? {
              text: conversation.lastMessageText,
              createdAt: conversation.lastMessageAt || conversation.updatedAt || null,
              senderRole:
                conversation.lastMessageSenderRole ||
                conversation.lastMessageRole ||
                'CUSTOMER',
            }
          : null,
    unreadCount: Number(
      conversation.unreadCount ?? conversation.unreadMessagesCount ?? conversation.unread ?? 0
    ),
    booking,
  };
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatDateTime = (value) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    hour12: true,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const messageDay = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatDate = (value) => {
  if (!messageDay(value)) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (messageDay(value) === messageDay(today)) return 'Today';
  if (messageDay(value) === messageDay(yesterday)) return 'Yesterday';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const formatConversationTime = (value) => {
  if (!messageDay(value)) return '';
  return messageDay(value) === messageDay(new Date()) ? formatTime(value) : formatDate(value);
};

const isToday = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const makeClientMessageId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure message IDs are not available in this browser.');
  }
  const values = globalThis.crypto.getRandomValues(new Uint8Array(16));
  values[6] = (values[6] & 0x0f) | 0x40;
  values[8] = (values[8] & 0x3f) | 0x80;
  const hex = [...values].map((value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const sendChatMessageOverSocket = (socket, payload) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Chat did not acknowledge the message. Retry to resend safely.'));
    }, 10000);
    socket.emit('chat:send', payload, (ack = {}) => {
      clearTimeout(timeout);
      if (ack.success === false || ack.error) {
        reject(new Error(ack.message || ack.error || 'Chat rejected the message.'));
        return;
      }
      resolve(ack);
    });
  });

const getChatSocketUrl = () => {
  const configuredUrl = import.meta.env.DEV ? import.meta.env.VITE_CHAT_SOCKET_URL : null;
  if (configuredUrl) return configuredUrl.trim().replace(/\/+$/, '');
  const baseUrl = API_BASE_URL;
  const origin = baseUrl.trim().replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  return `${origin}/chat`;
};

const getBookingSummary = (booking) => {
  if (!booking) return null;
  const service =
    booking.serviceName ||
    booking.service?.name ||
    booking.serviceItems?.[0]?.serviceName ||
    booking.packageTitle ||
    'Service details unavailable';
  const appointmentTime =
    booking.slotStart || booking.scheduledAt || booking.appointmentAt || booking.scheduledVisitTime;
  const amount =
    booking.totalRupees != null
      ? `₹${Number(booking.totalRupees).toLocaleString('en-IN')}`
      : booking.totalAmount != null
        ? `₹${Number(booking.totalAmount).toLocaleString('en-IN')}`
        : '—';
  return {
    service,
    appointmentTime,
    status: booking.status || '—',
    paymentStatus: booking.paymentStatus || '—',
    amount,
    bookingId: booking.bookingNumber || booking.publicId || booking.id || null,
  };
};

export default function SpaOwnerChatInbox({
  activeSpaName = 'Spa',
  spaLogo,
  ownerToken,
  isVisible = true,
  enabled = true,
  onUnreadCountChange,
  onActiveConversationChange,
  requestedConversationId,
  onRequestedConversationHandled,
}) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [connectionState, setConnectionState] = useState('connecting');
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [olderMessagesLoading, setOlderMessagesLoading] = useState(false);
  const [nextConversationCursor, setNextConversationCursor] = useState(null);
  const [nextMessageCursor, setNextMessageCursor] = useState(null);
  const [error, setError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [visiblePage, setVisiblePage] = useState(true);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [bookingExpanded, setBookingExpanded] = useState(true);
  const [openConversationId, setOpenConversationId] = useState('');
  const openConversationRef = useRef('');
  const searchInitializedRef = useRef(false);
  const socketRef = useRef(null);
  const conversationsRef = useRef([]);
  const heartbeatRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pendingSendRef = useRef(null);
  const activeConversationRef = useRef('');
  const isVisibleRef = useRef(isVisible);
  const visiblePageRef = useRef(visiblePage);
  const readSignatureRef = useRef('');
  const messageListRef = useRef(null);
  const messagesEndRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    visiblePageRef.current = visiblePage;
  }, [visiblePage]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );
  const totalUnread = useMemo(
    () => conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    [conversations]
  );
  const bookingSummary = getBookingSummary(activeConversation?.booking);

  useEffect(() => {
    onUnreadCountChange?.(totalUnread);
  }, [totalUnread, onUnreadCountChange]);

  useEffect(() => {
    onActiveConversationChange?.(
      isVisible && visiblePage && activeConversationId ? activeConversationId : null
    );
    return () => onActiveConversationChange?.(null);
  }, [activeConversationId, isVisible, visiblePage, onActiveConversationChange]);

  const loadConversations = useCallback(
    async ({ before, append = false, searchTerm = '' } = {}) => {
      if (!enabled || !ownerToken) return;
      try {
        setError('');
        setConversationsLoading(!append);
        const response = await getSpaOwnerChatConversations({
          limit: 20,
          before,
          search: searchTerm,
        });
        const data = unwrapData(response);
        const records = Array.isArray(data)
          ? data
          : data?.conversations || data?.items || data?.results || [];
        const normalized = records
          .map(normalizeConversation)
          .filter((conversation) => conversation.id)
          .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
        setConversations((previous) => {
          if (!append) return normalized;
          const existingIds = new Set(previous.map((conversation) => conversation.id));
          return [
            ...previous,
            ...normalized.filter((conversation) => !existingIds.has(conversation.id)),
          ];
        });
        setNextConversationCursor(getCursor(response));
        if (!append && !activeConversationRef.current && normalized.length) {
          setActiveConversationId(normalized[0].id);
        }
      } catch (loadError) {
        setError(
          loadError?.status === 404 && loadError?.code === 'NOT_FOUND'
            ? 'The chat inbox API is not available on this server yet (GET /api/v1/spa-owner/chat/conversations returned 404). The backend chat routes must be deployed before conversations can load.'
            : loadError?.message || 'Could not load conversations.'
        );
      } finally {
        setConversationsLoading(false);
      }
    },
    [enabled, ownerToken]
  );

  useEffect(() => {
    if (enabled && ownerToken) loadConversations({ searchTerm: '' });
  }, [enabled, ownerToken, loadConversations]);

  useEffect(() => {
    if (!searchInitializedRef.current) {
      searchInitializedRef.current = true;
      return undefined;
    }
    const timeout = setTimeout(() => {
      setActiveConversationId('');
      setMessages([]);
      loadConversations({ searchTerm: search.trim() });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, loadConversations]);

  const loadMessages = useCallback(
    async (conversationId, { before, prepend = false } = {}) => {
      if (!conversationId) return;
      const requestId = ++requestIdRef.current;
      try {
        setMessageError('');
        if (prepend) setOlderMessagesLoading(true);
        else setMessagesLoading(true);
        const response = await getSpaOwnerChatMessages({
          conversationId,
          limit: 30,
          before,
        });
        if (requestId !== requestIdRef.current) return;
        const records = getConversationMessages(response);
        const latestMessage = conversationsRef.current.find(
          (conversation) => conversation.id === conversationId
        )?.lastMessage;
        const messagesToNormalize =
          records.length === 0 &&
          (latestMessage?.text ||
            latestMessage?.content ||
            latestMessage?.body ||
            latestMessage?.message ||
            latestMessage?.preview)
            ? [{ ...latestMessage, __fallbackId: `${conversationId}:last-message` }]
            : records.map((message, index) => ({
                ...message,
                __fallbackId: `${conversationId}:${index}:${message.createdAt || message.sentAt || ''}`,
              }));
        const incoming = messagesToNormalize.map(normalizeMessage);
        setMessages((previous) => {
          const combined = prepend ? [...incoming, ...previous] : incoming;
          const seen = new Set();
          return combined.filter((message) => {
            const id = message.id || message.clientMessageId;
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        });
        setNextMessageCursor(getCursor(response));
        if (!prepend) {
          requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }));
        }
      } catch (loadError) {
        if (requestId === requestIdRef.current) {
          setMessageError(loadError?.message || 'Could not load message history.');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setMessagesLoading(false);
          setOlderMessagesLoading(false);
        }
      }
    },
    []
  );

  const selectConversation = useCallback((conversationId) => {
    if (!conversationId) return;
    if (conversationId === activeConversationRef.current) {
      setMobileShowChat(true);
      loadMessages(conversationId);
      return;
    }
    setActiveConversationId(conversationId);
    activeConversationRef.current = conversationId;
    readSignatureRef.current = '';
    setMessages([]);
    setNextMessageCursor(null);
    setMessageError('');
    setMobileShowChat(true);
    setOpenConversationId('');
  }, [loadMessages]);

  useEffect(() => {
    if (!activeConversationId) return undefined;
    let active = true;
    const fetchConversation = async () => {
      try {
        const response = await getSpaOwnerChatConversation(activeConversationId);
        const data = unwrapData(response);
        const record = data?.conversation || data;
        if (active && record && getConversationId(record)) {
          const normalized = normalizeConversation(record);
          setConversations((previous) => {
            const found = previous.some((conversation) => conversation.id === activeConversationId);
            const updated = found
              ? previous.map((conversation) =>
                  conversation.id === activeConversationId
                    ? { ...conversation, ...normalized, id: activeConversationId }
                    : conversation
                )
              : [{ ...normalized, id: activeConversationId }, ...previous];
            return updated.sort(
              (a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
            );
          });
        }
      } catch (loadError) {
        if (active) {
          setMessageError(loadError?.message || 'Could not load conversation details.');
        }
      }
      if (active) await loadMessages(activeConversationId);
    };
    fetchConversation();
    return () => {
      active = false;
    };
  }, [activeConversationId, loadMessages]);

  useEffect(() => {
    if (requestedConversationId) {
      selectConversation(requestedConversationId);
      onRequestedConversationHandled?.();
    }
  }, [
    requestedConversationId,
    selectConversation,
    onRequestedConversationHandled,
  ]);

  useEffect(() => {
    if (!enabled || !ownerToken) {
      setConnectionState('disconnected');
      return undefined;
    }

    const configuredUrl = getChatSocketUrl();
    const socket = io(configuredUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token: ownerToken, role: 'SPA_OWNER' },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;
    setConnectionState('connecting');

    const onConnect = () => {
      setConnectionState('connected');
      const conversationId = activeConversationRef.current;
      if (conversationId) {
        readSignatureRef.current = '';
        loadMessages(conversationId);
      }
    };
    const onDisconnect = () => setConnectionState('disconnected');
    const onConnectError = (socketError) => {
      setConnectionState('error');
      setError(socketError?.message || 'Chat connection failed. Retrying…');
    };
    const onMessage = (payload = {}) => {
      const message = normalizeMessage(payload.message || payload.data?.message || payload);
      const conversationId =
        payload.conversationId ||
        payload.data?.conversationId ||
        payload.data?.conversation?.id ||
        payload.data?.conversation?.publicId ||
        payload.conversation?.id ||
        payload.conversation?.publicId ||
        payload.conversation?._id;
      if (!conversationId) return;

      const lastMessageAt = message.createdAt || new Date().toISOString();
      if (!conversationsRef.current.some((conversation) => conversation.id === conversationId)) {
        loadConversations({ searchTerm: '' });
      }
      setConversations((previous) => {
        const exists = previous.some((conversation) => conversation.id === conversationId);
        if (!exists) return previous;
        return previous
          .map((conversation) => {
            if (conversation.id !== conversationId) return conversation;
            const isCurrent =
              activeConversationRef.current === conversationId &&
              isVisibleRef.current &&
              visiblePageRef.current;
            return {
              ...conversation,
              lastMessageText: message.text,
              lastMessageAt,
              unreadCount: isCurrent ? conversation.unreadCount : conversation.unreadCount + (message.owner ? 0 : 1),
            };
          })
          .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      });

      if (activeConversationRef.current === conversationId) {
        setMessages((previous) => {
          const messageId = message.id || message.clientMessageId;
          if (
            previous.some(
              (existing) =>
                (messageId && getMessageId(existing) === messageId) ||
                (message.clientMessageId &&
                  existing.clientMessageId === message.clientMessageId)
            )
          ) {
            return previous;
          }
          return [...previous, message];
        });
      }
    };
    const onRead = (payload = {}) => {
      const conversationId = payload.conversationId || payload.data?.conversationId;
      if (conversationId !== activeConversationRef.current) return;
      const readerRole = String(payload.role || payload.readerRole || '').toUpperCase();
      if (readerRole && ['SPA_OWNER', 'OWNER', 'SPA'].includes(readerRole)) return;
      setMessages((previous) =>
        previous.map((message) => (message.owner ? { ...message, read: true } : message))
      );
    };
    const onTyping = (payload = {}) => {
      const conversationId = payload.conversationId || payload.data?.conversationId;
      if (conversationId !== activeConversationRef.current) return;
      const role = String(payload.role || payload.senderRole || '').toUpperCase();
      if (['SPA_OWNER', 'OWNER', 'SPA'].includes(role)) return;
      setTyping(Boolean(payload.isTyping ?? payload.typing));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('chat:message', onMessage);
    socket.on('chat:read', onRead);
    socket.on('chat:typing', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('chat:message', onMessage);
      socket.off('chat:read', onRead);
      socket.off('chat:typing', onTyping);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
      const conversationId = activeConversationRef.current;
      if (socket.connected && conversationId) socket.emit('chat:close', { conversationId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, ownerToken, loadConversations, loadMessages]);

  const closeOpenConversation = useCallback(() => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
    const conversationId = openConversationRef.current;
    if (conversationId && socketRef.current?.connected) {
      socketRef.current.emit('chat:close', { conversationId });
    }
    openConversationRef.current = '';
    setOpenConversationId('');
  }, []);

  useEffect(() => {
    if (!enabled || !isVisible || !visiblePage || !activeConversationId || !socketRef.current?.connected) {
      closeOpenConversation();
      return undefined;
    }

    const socket = socketRef.current;
    const acknowledgementTimeout = setTimeout(() => {
      setMessageError('Chat did not confirm that the conversation opened. Reconnect and try again.');
    }, 10000);
    socket.emit('chat:open', { conversationId: activeConversationId }, (ack = {}) => {
      clearTimeout(acknowledgementTimeout);
      if (activeConversationRef.current !== activeConversationId) {
        socket.emit('chat:close', { conversationId: activeConversationId });
        return;
      }
      if (ack.success === false || ack.error) {
        setMessageError(ack.message || ack.error || 'Could not open this conversation.');
        return;
      }
      openConversationRef.current = activeConversationId;
      setOpenConversationId(activeConversationId);
      socket.emit('chat:heartbeat', { conversationId: activeConversationId });
      heartbeatRef.current = setInterval(() => {
        socket.emit('chat:heartbeat', { conversationId: activeConversationId });
      }, 15000);
    });

    return () => {
      clearTimeout(acknowledgementTimeout);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
      if (socket.connected) socket.emit('chat:close', { conversationId: activeConversationId });
      if (openConversationRef.current === activeConversationId) openConversationRef.current = '';
      setOpenConversationId('');
    };
  }, [
    enabled,
    isVisible,
    visiblePage,
    activeConversationId,
    connectionState,
    closeOpenConversation,
  ]);

  useEffect(() => {
    const handleVisibility = () => setVisiblePage(document.visibilityState === 'visible');
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!activeConversationId || !messages.length || messagesLoading || !openConversationId) return;
    const lastId = getMessageId(messages[messages.length - 1]);
    const signature = `${activeConversationId}:${lastId}`;
    if (readSignatureRef.current === signature) return;

    let active = true;
    const frame = requestAnimationFrame(() => {
      if (!active || !messageListRef.current) return;
      readSignatureRef.current = signature;
      socketRef.current?.emit('chat:read', { conversationId: activeConversationId });
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )
      );
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [activeConversationId, messages, messagesLoading, openConversationId]);

  useEffect(() => {
    if (messages.length) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (filter === 'UNREAD' && conversation.unreadCount < 1) return false;
      if (
        filter === 'TODAY' &&
        !isToday(conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt)
      ) {
        return false;
      }
      if (!query) return true;
      const historyText = conversation.id === activeConversationId
        ? messages.map((message) => message.text).join(' ')
        : '';
      return `${conversation.customerName} ${conversation.lastMessageText} ${historyText}`
        .toLowerCase()
        .includes(query);
    });
  }, [conversations, filter, search, activeConversationId, messages]);

  const sendTyping = useCallback(
    (isTyping) => {
      if (!activeConversationId || !socketRef.current?.connected) return;
      socketRef.current.emit('chat:typing', {
        conversationId: activeConversationId,
        isTyping,
      });
    },
    [activeConversationId]
  );

  const handleDraftChange = (value) => {
    setDraft(value);
    if (value.trim()) {
      sendTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1200);
    } else {
      sendTyping(false);
    }
  };

  const handleSend = async (event) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || text.length > 4000 || !activeConversationId || sendLoading) return;

    let clientMessageId;
    try {
      clientMessageId =
        pendingSendRef.current?.text === text
          ? pendingSendRef.current.id
          : makeClientMessageId();
    } catch (idError) {
      setMessageError(idError.message);
      return;
    }
    pendingSendRef.current = { text, id: clientMessageId };
    const optimisticMessage = normalizeMessage({
      id: clientMessageId,
      clientMessageId,
      text,
      createdAt: new Date().toISOString(),
      senderRole: 'SPA_OWNER',
      status: 'SENDING',
    });
    setMessages((previous) => {
      if (previous.some((message) => message.clientMessageId === clientMessageId)) {
        return previous.map((message) =>
          message.clientMessageId === clientMessageId
            ? { ...message, sendStatus: 'SENDING' }
            : message
        );
      }
      return [...previous, { ...optimisticMessage, sendStatus: 'SENDING' }];
    });
    setMessageError('');
    setSendLoading(true);
    sendTyping(false);
    try {
      const payload = { text, clientMessageId };
      const response = socketRef.current?.connected
        ? await sendChatMessageOverSocket(socketRef.current, {
            conversationId: activeConversationId,
            ...payload,
          })
        : await sendSpaOwnerChatMessage(activeConversationId, payload);
      const data = unwrapData(response);
      const responseMessage =
        data?.message ||
        (data?.id || data?._id || data?.text || data?.content ? data : null);
      const sent = normalizeMessage(
        responseMessage || { ...optimisticMessage, createdAt: new Date().toISOString() }
      );
      setMessages((previous) =>
        previous.map((message) =>
          message.clientMessageId === clientMessageId || message.id === clientMessageId
            ? { ...sent, clientMessageId, sendStatus: 'SENT' }
            : message
        )
      );
      setConversations((previous) =>
        previous
          .map((conversation) =>
            conversation.id === activeConversationId
              ? {
                  ...conversation,
                  lastMessageText: text,
                  lastMessageAt: sent.createdAt || new Date().toISOString(),
                }
              : conversation
          )
          .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0))
      );
      pendingSendRef.current = null;
      setDraft('');
    } catch (sendError) {
      setMessages((previous) =>
        previous.map((message) =>
          message.clientMessageId === clientMessageId
            ? { ...message, sendStatus: 'FAILED' }
            : message
        )
      );
      setMessageError(`${sendError?.message || 'Message was not sent.'} Retry to resend safely.`);
    } finally {
      setSendLoading(false);
    }
  };

  const handleLoadOlderConversations = () => {
    if (nextConversationCursor) {
      loadConversations({ before: nextConversationCursor, append: true, searchTerm: search });
    }
  };

  const handleLoadOlderMessages = async () => {
    if (!nextMessageCursor || !activeConversationId || olderMessagesLoading) return;
    const list = messageListRef.current;
    const oldHeight = list?.scrollHeight || 0;
    await loadMessages(activeConversationId, { before: nextMessageCursor, prepend: true });
    requestAnimationFrame(() => {
      if (list) list.scrollTop = list.scrollHeight - oldHeight;
    });
  };

  const retryMessage = (message) => {
    setDraft(message.text);
    pendingSendRef.current = {
      text: message.text,
      id: message.clientMessageId || message.id,
    };
  };

  const isConnectionReady = connectionState === 'connected';

  return (
    <div className="w-full min-w-0">
      <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center gap-2">
          {spaLogo && (
            <img
              src={spaLogo}
              alt=""
              className="h-9 w-9 rounded-xl border border-gray-200 bg-white object-contain p-1"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#F35271]">
            <MessageSquare className="h-3.5 w-3.5" />
            {activeSpaName}
          </div>
          <h2 className="mt-1 text-xl font-bold text-[#0D0D12]">Client Messages &amp; Chat</h2>
          <p className="mt-1 text-xs text-gray-500">Customer conversations and booking context.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
            isConnectionReady
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : connectionState === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}>
            {isConnectionReady ? 'Live' : connectionState === 'error' ? 'Reconnecting' : 'Connecting'}
          </span>
          <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-[#F35271]">
            {totalUnread} unread
          </span>
        </div>
      </div>

      {!enabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Complete your spa profile to unlock Client Messages &amp; Chat.
        </div>
      )}

      {enabled && (
        <div className="flex h-[calc(100dvh-180px)] min-h-[560px] max-h-[820px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <aside className={`flex w-full shrink-0 flex-col border-r border-gray-100 bg-[#FAFAFB] md:w-[360px] ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="border-b border-gray-100 bg-white p-3.5">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer or message"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#F35271]"
                />
              </label>
              <div className="mt-3 flex gap-1.5">
                {['ALL', 'UNREAD', 'TODAY'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                      filter === tab ? 'bg-[#0D0D12] text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => loadConversations({ searchTerm: search })}
                  className="ml-auto rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                  aria-label="Refresh conversations"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${conversationsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {error && (
                <div className="mb-2 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] text-rose-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {conversationsLoading && conversations.length === 0 ? (
                <div className="flex h-40 items-center justify-center gap-2 text-xs text-gray-500">
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Loading conversations…
                </div>
              ) : visibleConversations.length === 0 && !error ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-xs text-gray-400">
                  <MessageSquare className="h-7 w-7" />
                  <span>{search ? 'No matching conversations.' : 'No conversations yet.'}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {visibleConversations.map((conversation) => {
                    const selected = conversation.id === activeConversationId;
                    const avatar = resolveMediaUrl(conversation.customerAvatar);
                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => selectConversation(conversation.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                          selected ? 'border border-rose-200 bg-white shadow-sm' : 'border border-transparent hover:bg-white'
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-rose-50 text-[#F35271]">
                          {avatar ? (
                            <img src={avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <UserRound className="h-5 w-5" />
                          )}
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-bold text-[#0D0D12]">{conversation.customerName}</span>
                            <span className="shrink-0 text-[10px] text-gray-400">{formatConversationTime(conversation.lastMessageAt)}</span>
                          </span>
                          <span className="mt-1 block truncate text-[11px] text-gray-500">
                            {conversation.lastMessageText || 'No messages yet'}
                          </span>
                          {conversation.booking && (
                            <span className="mt-1 flex items-center gap-1 truncate text-[10px] font-medium text-[#F35271]">
                              <Calendar className="h-3 w-3 shrink-0" />
                              {conversation.booking.serviceName ||
                                conversation.booking.service?.name ||
                                conversation.booking.serviceItems?.[0]?.serviceName ||
                                'Booking linked'}
                            </span>
                          )}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#F35271] px-1 text-[10px] font-bold text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {nextConversationCursor && (
                <button
                  type="button"
                  onClick={handleLoadOlderConversations}
                  disabled={conversationsLoading}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold text-gray-500 hover:bg-white disabled:opacity-50"
                >
                  <ChevronDown className="h-3.5 w-3.5" /> Load older conversations
                </button>
              )}
            </div>
          </aside>

          <section className={`flex min-w-0 flex-1 flex-col ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
            {!activeConversation ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-gray-400">
                <MessageSquare className="h-10 w-10" />
                <p className="text-sm">Select a conversation to view messages.</p>
              </div>
            ) : (
              <>
                <header className="flex items-center gap-3 border-b border-gray-100 px-3 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50 text-[#F35271]">
                    {resolveMediaUrl(activeConversation.customerAvatar) ? (
                      <img src={resolveMediaUrl(activeConversation.customerAvatar)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#0D0D12]">{activeConversation.customerName}</h3>
                    <p className="text-[10px] text-gray-500">
                      {isConnectionReady ? 'Connected to chat' : 'Reconnecting to chat…'}
                    </p>
                  </div>
                  {bookingSummary && (
                    <button
                      type="button"
                      onClick={() => setBookingExpanded((expanded) => !expanded)}
                      className="flex items-center gap-1 rounded-xl border border-gray-200 px-2.5 py-2 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#F35271]" />
                      Booking
                      <ChevronDown className={`h-3 w-3 transition ${bookingExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </header>

                {bookingSummary && bookingExpanded && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-rose-100 bg-rose-50/60 px-4 py-3 text-[10px] sm:grid-cols-5">
                    <div className="col-span-2 min-w-0 sm:col-span-1">
                      <span className="block text-gray-500">Service</span>
                      <span className="mt-0.5 block truncate font-bold text-gray-800">{bookingSummary.service}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-gray-500">Appointment</span>
                      <span className="mt-0.5 block truncate font-semibold text-gray-800">{formatDateTime(bookingSummary.appointmentTime)}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Status</span>
                      <span className="mt-0.5 block truncate font-semibold text-gray-800">{bookingSummary.status}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Payment</span>
                      <span className="mt-0.5 block truncate font-semibold text-gray-800">{bookingSummary.paymentStatus}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Total</span>
                      <span className="mt-0.5 block truncate font-bold text-[#F35271]">{bookingSummary.amount}</span>
                    </div>
                    {bookingSummary.bookingId && (
                      <p className="col-span-full truncate text-[9px] text-gray-400">
                        Booking {bookingSummary.bookingId}. Messages do not change appointment details.
                      </p>
                    )}
                  </div>
                )}

                {messageError && (
                  <div className="flex items-start gap-2 border-b border-rose-100 bg-rose-50 px-4 py-2 text-[11px] text-rose-800">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{messageError}</span>
                    <button type="button" onClick={() => setMessageError('')} className="font-bold">Dismiss</button>
                  </div>
                )}

                <div ref={messageListRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FCFCFD] px-3 py-4 sm:px-5">
                  {nextMessageCursor && (
                    <button
                      type="button"
                      onClick={handleLoadOlderMessages}
                      disabled={olderMessagesLoading}
                      className="mx-auto flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-500 shadow-sm disabled:opacity-50"
                    >
                      {olderMessagesLoading ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
                      Load older messages
                    </button>
                  )}
                  {messagesLoading && messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center gap-2 text-xs text-gray-500">
                      <LoaderCircle className="h-4 w-4 animate-spin" /> Loading message history…
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      No messages yet. Send a message to start the conversation.
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={message.id || message.clientMessageId || `${index}-${message.createdAt}`}>
                        {messageDay(message.createdAt) && (index === 0 || messageDay(message.createdAt) !== messageDay(messages[index - 1].createdAt)) && (
                          <div className="my-4 flex justify-center">
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-semibold text-gray-500">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${message.owner ? 'justify-end' : 'justify-start'}`}>

                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[75%] ${
                          message.owner
                            ? 'rounded-br-sm bg-[#F35271] text-white'
                            : 'rounded-bl-sm border border-gray-100 bg-white text-[#0D0D12]'
                        }`}>
                          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{message.text}</p>
                          <div className={`mt-1 flex items-center justify-end gap-1.5 text-[9px] ${message.owner ? 'text-white/75' : 'text-gray-400'}`}>
                            <span title={formatDateTime(message.createdAt)}>{formatTime(message.createdAt)}</span>
                            {message.owner && (
                              message.sendStatus === 'FAILED' ? (
                                <button type="button" onClick={() => retryMessage(message)} className="font-bold underline">Retry</button>
                              ) : message.read ? (
                                <CheckCheck className="h-3 w-3" aria-label="Read" />
                              ) : message.sendStatus === 'SENDING' ? (
                                <Clock3 className="h-3 w-3" aria-label="Sending" />
                              ) : (
                                <Check className="h-3 w-3" aria-label="Sent" />
                              )
                            )}
                          </div>
                        </div>
                        </div>
                      </div>
                    ))
                  )}
                  {typing && (
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="flex gap-1 rounded-full bg-white px-3 py-2 shadow-sm">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F35271]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F35271] [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F35271] [animation-delay:240ms]" />
                      </span>
                      Customer is typing…
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="border-t border-gray-100 bg-white p-3 sm:p-4">
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <textarea
                        value={draft}
                        onChange={(event) => handleDraftChange(event.target.value)}
                        onBlur={() => sendTyping(false)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSend(event);
                          }
                        }}
                        maxLength={4000}
                        rows={1}
                        placeholder={`Message ${activeConversation.customerName}…`}
                        className="max-h-28 min-h-11 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs outline-none focus:border-[#F35271]"
                      />
                      <div className="mt-1 flex justify-between text-[9px] text-gray-400">
                        <span>Sending a message does not reschedule a booking.</span>
                        <span>{draft.trim().length}/4000</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!draft.trim() || draft.trim().length > 4000 || sendLoading}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F35271] text-white transition hover:bg-[#df4261] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={sendLoading ? 'Sending message' : 'Send message'}
                    >
                      {sendLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
