import { apiClient } from './client';

export const companyAPI = {
  // 기업 프로필 조회
  getCompanyProfile: async () => {
    const response = await apiClient.get('/profiles/company');
    return response.data.data || response.data;
  },

  // 기업 프로필 수정
  updateCompanyProfile: async (profileData) => {
    const response = await apiClient.put('/profiles/company', profileData);
    return response.data;
  },

  // 내 회사 채용공고 목록
  getMyJobPostings: async () => {
    const response = await apiClient.get('/jobpostings/my');
    return response.data.data || response.data || [];
  }
};