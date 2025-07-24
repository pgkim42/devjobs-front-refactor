// 사용자 정보 가져오기
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
};

// 로그인 여부 확인
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = getUser();
  return !!(token && user?.id);
};

// 역할 확인
export const hasRole = (role) => {
  const user = getUser();
  // ROLE_ prefix 제거하고 비교
  const userRole = user?.role?.replace('ROLE_', '');
  return userRole === role;
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};