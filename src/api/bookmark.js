import { apiClient } from './client';

export const bookmarkAPI = {
  // 북마크 토글 (추가/제거)
  toggleBookmark: async (jobPostingId) => {
    const response = await apiClient.post(`/bookmarks/toggle/${jobPostingId}`);
    return response.data.data;
  },

  // 북마크 여부 확인
  checkBookmark: async (jobPostingId) => {
    const response = await apiClient.get(`/bookmarks/check/${jobPostingId}`);
    return response.data.data;
  },

  // 내 북마크 목록 조회
  getMyBookmarks: async ({ page = 0, size = 12 } = {}) => {
    const response = await apiClient.get('/bookmarks/my', {
      params: { page, size }
    });
    return response.data.data;
  },

  // 북마크한 공고 ID 목록 조회
  getBookmarkedIds: async () => {
    const response = await apiClient.get('/bookmarks/ids');
    return response.data.data;
  },

  // 북마크 개수 조회
  getBookmarkCount: async () => {
    const response = await apiClient.get('/bookmarks/count');
    return response.data.data;
  }
};