import { apiClient } from './client';

export const authAPI = {
  // 로그인 - JWT 토큰만 반환
  signIn: async (credentials) => {
    const response = await apiClient.post('/auth/signin', credentials);
    const token = response.data.data; // JWT 토큰 문자열
    
    if (token) {
      localStorage.setItem('accessToken', token);
      
      // 사용자 정보 가져오기
      const userInfo = await authAPI.getCurrentUser();
      return { token, user: userInfo };
    }
    
    throw new Error('로그인 실패');
  },

  // 현재 사용자 정보 - userId, role(ROLE_ prefix) 포함
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    const userData = response.data.data;
    
    if (userData) {
      // userId를 id로도 저장 (호환성)
      const normalizedUser = {
        ...userData,
        id: userData.userId
      };
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return normalizedUser;
    }
    
    return null;
  },

  // 개인 회원가입
  signUpIndividual: async (userData) => {
    const response = await apiClient.post('/auth/signup/individual', userData);
    return response.data;
  },

  // 기업 회원가입
  signUpCompany: async (userData) => {
    const response = await apiClient.post('/auth/signup/company', userData);
    return response.data;
  },

  // 로그아웃
  signOut: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};