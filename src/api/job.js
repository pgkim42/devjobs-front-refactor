import { apiClient } from './client';

export const jobAPI = {
  // 채용공고 목록 (페이징) - content 배열 반환
  getJobList: async (params) => {
    const response = await apiClient.get('/jobpostings', { params });
    // Page 객체의 content 배열 반환
    return response.data.data.content || [];
  },
  
  // 내 회사 채용공고 (List) - 배열 직접 반환
  getMyJobPostings: async () => {
    const response = await apiClient.get('/jobpostings/my');
    return response.data.data || [];
  },

  // 채용공고 상세 - companyInfo 포함
  getJobDetail: async (id) => {
    const response = await apiClient.get(`/jobpostings/${id}`);
    return response.data.data;
  },

  // 채용공고 등록
  createJob: async (jobData) => {
    const response = await apiClient.post('/jobpostings', jobData);
    return response.data;
  },

  // 채용공고 수정
  updateJob: async (id, jobData) => {
    const response = await apiClient.patch(`/jobpostings/${id}`, jobData);
    return response.data;
  },

  // 채용공고 삭제
  deleteJob: async (id) => {
    const response = await apiClient.delete(`/jobpostings/${id}`);
    return response.data;
  },

  // 채용공고 페이지 정보 (전체 수, 페이지 수 등)
  getJobListWithPageInfo: async (params) => {
    const response = await apiClient.get('/jobpostings', { params });
    return response.data.data; // 전체 Page 객체 반환
  }
};