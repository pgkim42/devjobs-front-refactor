import { apiClient } from './client';

export const profileAPI = {
  // 개인 프로필 조회
  getIndividualProfile: async () => {
    const response = await apiClient.get('/profiles/individual');
    return response.data.data;
  },

  // 개인 프로필 수정
  updateIndividualProfile: async (profileData) => {
    const response = await apiClient.put('/profiles/individual', profileData);
    return response.data.data;
  },

  // 이력서 등록 (파일 업로드)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/profiles/individual/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // 기업 프로필 조회
  getCompanyProfile: async () => {
    const response = await apiClient.get('/profiles/company');
    return response.data.data;
  },

  // 기업 프로필 수정
  updateCompanyProfile: async (profileData) => {
    const response = await apiClient.put('/profiles/company', profileData);
    return response.data.data;
  }
};