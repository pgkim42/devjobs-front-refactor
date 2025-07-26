import { apiClient as client } from './client';

const adminService = {
  // 개인회원 목록 조회
  getIndividualUsers: async (params = {}) => {
    const response = await client.get('/admin/users/individual', { params });
    return response.data;
  },

  // 기업회원 목록 조회
  getCompanyUsers: async (params = {}) => {
    const response = await client.get('/admin/users/company', { params });
    return response.data;
  },

  // 개인회원 상세 조회
  getIndividualUser: async (userId) => {
    const response = await client.get(`/admin/users/individual/${userId}`);
    return response.data;
  },

  // 기업회원 상세 조회
  getCompanyUser: async (userId) => {
    const response = await client.get(`/admin/users/company/${userId}`);
    return response.data;
  },

  // 채용공고 목록 조회
  getJobPostings: async (params = {}) => {
    const response = await client.get('/admin/job-postings', { params });
    return response.data;
  },

  // 채용공고 삭제
  deleteJobPosting: async (jobId) => {
    const response = await client.delete(`/admin/job-postings/${jobId}`);
    return response.data;
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    const response = await client.get('/job-categories');
    return response.data;
  },

  // 카테고리 생성
  createCategory: async (data) => {
    const response = await client.post('/job-categories', data);
    return response.data;
  },

  // 카테고리 수정
  updateCategory: async (categoryId, data) => {
    const response = await client.put(`/job-categories/${categoryId}`, data);
    return response.data;
  },

  // 카테고리 삭제
  deleteCategory: async (categoryId) => {
    const response = await client.delete(`/job-categories/${categoryId}`);
    return response.data;
  }
};

export default adminService;