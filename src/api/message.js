import { apiClient } from './client';

export const messageAPI = {
  // 메시지 보내기
  sendMessage: async (data) => {
    const response = await apiClient.post('/messages', data);
    return response.data.data;
  },

  // 받은 쪽지함
  getReceivedMessages: async ({ page = 0, size = 20 } = {}) => {
    const response = await apiClient.get('/messages/received', {
      params: { page, size }
    });
    return response.data.data;
  },

  // 보낸 쪽지함
  getSentMessages: async ({ page = 0, size = 20 } = {}) => {
    const response = await apiClient.get('/messages/sent', {
      params: { page, size }
    });
    return response.data.data;
  },

  // 읽지 않은 메시지 개수
  getUnreadCount: async () => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data.data;
  },

  // 메시지 상세 조회 (자동 읽음 처리)
  getMessage: async (messageId) => {
    const response = await apiClient.get(`/messages/${messageId}`);
    return response.data.data;
  },

  // 읽음 처리
  markAsRead: async (messageId) => {
    const response = await apiClient.patch(`/messages/${messageId}/read`);
    return response.data;
  }
};