import { apiClient } from './apiClient.js';

const getConversationPath = (conversationId) => {
  if (!conversationId) {
    throw new Error('Conversation ID is required.');
  }
  return `/spa-owner/chat/conversations/${encodeURIComponent(String(conversationId))}`;
};

export const getSpaOwnerChatConversations = ({ limit = 20, before, search } = {}) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set('before', before);
  if (search?.trim()) params.set('search', search.trim());
  return apiClient(`/spa-owner/chat/conversations?${params.toString()}`, { method: 'GET' });
};

export const getSpaOwnerChatConversation = (conversationId) =>
  apiClient(getConversationPath(conversationId), { method: 'GET' });

export const getSpaOwnerChatMessages = ({ conversationId, limit = 30, before } = {}) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set('before', before);
  return apiClient(
    `${getConversationPath(conversationId)}/messages?${params.toString()}`,
    { method: 'GET' }
  );
};

export const sendSpaOwnerChatMessage = (conversationId, { text, clientMessageId } = {}) => {
  const cleanText = String(text || '').trim();
  if (!cleanText || cleanText.length > 4000) {
    throw new Error('Message must be between 1 and 4000 characters.');
  }
  if (!clientMessageId) {
    throw new Error('A client message ID is required.');
  }
  return apiClient(`${getConversationPath(conversationId)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text: cleanText, clientMessageId }),
  });
};

export const markSpaOwnerChatConversationRead = (conversationId) =>
  apiClient(`${getConversationPath(conversationId)}/read`, { method: 'PATCH' });
