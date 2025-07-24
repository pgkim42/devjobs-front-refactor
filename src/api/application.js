import { apiClient } from './client';

export const applicationAPI = {
  // 지원하기
  apply: async (jobPostingId) => {
    const response = await apiClient.post('/applications', { jobPostingId });
    return response.data;
  },

  // 내 지원 목록 - jobTitle, companyName, status, appliedAt
  getMyApplications: async () => {
    const response = await apiClient.get('/applications/my');
    return response.data.data || [];
  },

  // 지원 취소
  cancelApplication: async (applicationId) => {
    const response = await apiClient.delete(`/applications/${applicationId}`);
    return response.data;
  },

  // 특정 공고의 지원자 목록 (기업용) - applicantName, applicantEmail, status, appliedAt
  getJobApplications: async (jobPostingId) => {
    const response = await apiClient.get(`/applications/job/${jobPostingId}`);
    return response.data.data || [];
  },

  // 지원 상태 변경 (기업용)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};