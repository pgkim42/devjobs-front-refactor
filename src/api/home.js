import { apiClient } from './client';

const homeAPI = {
  // 홈 대시보드 데이터 가져오기
  getDashboard: async () => {
    const response = await apiClient.get('/home/dashboard');
    return response.data.data;
  }
};

export default homeAPI;