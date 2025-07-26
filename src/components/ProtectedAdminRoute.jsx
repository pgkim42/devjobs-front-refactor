import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const ProtectedAdminRoute = ({ children }) => {
  const user = getUser();

  if (!user || !user.role?.includes('ADMIN')) {
    // 로그인하지 않았거나 관리자가 아닌 경우 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;