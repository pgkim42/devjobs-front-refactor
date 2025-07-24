import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getUser, logout } from '../utils/auth';

const HeaderContainer = styled.header`
  background: ${props => props.isHome ? 'transparent' : 'white'};
  box-shadow: ${props => props.isHome ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  
  ${props => props.scrolled && `
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `}
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #0066ff;
  
  &:hover {
    color: #0052cc;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavLink = styled(Link)`
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #0066ff;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserInfo = styled.span`
  color: #666;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  &.primary {
    background: #0066ff;
    color: white;
    
    &:hover {
      background: #0052cc;
    }
  }
  
  &.secondary {
    background: #f0f0f0;
    color: #333;
    
    &:hover {
      background: #e0e0e0;
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    // 페이지 이동 시마다 사용자 정보 확인
    const currentUser = getUser();
    console.log('Header - Current User:', currentUser);
    setUser(currentUser);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHome]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <HeaderContainer isHome={isHome} scrolled={scrolled}>
      <HeaderContent>
        <Logo to="/">DevJobs</Logo>
        
        <Nav>
          <NavLink to="/jobs">채용정보</NavLink>
          {user?.role?.includes('INDIVIDUAL') && (
            <>
              <NavLink to="/mypage">마이페이지</NavLink>
            </>
          )}
          {user?.role?.includes('COMPANY') && (
            <>
              <NavLink to="/mypage">마이페이지</NavLink>
              <NavLink to="/jobs/create">공고등록</NavLink>
            </>
          )}
        </Nav>
        
        <UserSection>
          {user ? (
            <>
              <UserInfo>{user.name || user.companyName || user.loginId || '사용자'}</UserInfo>
              <Button className="secondary" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="secondary">로그인</Button>
              </Link>
              <Link to="/signup">
                <Button className="primary">회원가입</Button>
              </Link>
            </>
          )}
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;