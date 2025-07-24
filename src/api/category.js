import { apiClient } from './client';

export const categoryAPI = {
  // 직무 카테고리 목록 - categoryName 필드
  getCategories: async () => {
    const response = await apiClient.get('/job-categories');
    return response.data.data || [];
  }
};