import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getUser, logout } from '../utils/auth';
import { messageAPI } from '../api';

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
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
  
  &:hover {
    color: #0066ff;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -16px;
  background: #ff4444;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
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

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
  
  span {
    display: block;
    width: 24px;
    height: 2px;
    background: #333;
    margin: 5px 0;
    transition: all 0.3s;
    
    &:nth-child(1) {
      transform: ${props => props.isOpen ? 'rotate(45deg) translateY(7px)' : 'none'};
    }
    
    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
    }
    
    &:nth-child(3) {
      transform: ${props => props.isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'};
    }
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 999;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 12px 0;
  color: #333;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  
  &:hover {
    color: #0066ff;
  }
`;

const MobileUserSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const MobileButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  
  &.primary {
    background: #0066ff;
    color: white;
  }
  
  &.secondary {
    background: #f0f0f0;
    color: #333;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isHome = location.pathname === '/';

  useEffect(() => {
    // 페이지 이동 시마다 사용자 정보 확인
    const currentUser = getUser();
    console.log('Header - Current User:', currentUser);
    setUser(currentUser);
    // 페이지 이동 시 모바일 메뉴 닫기
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // 로그인한 사용자의 읽지 않은 메시지 개수 가져오기
    if (user) {
      fetchUnreadCount();
      // 5초마다 업데이트
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

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

  const fetchUnreadCount = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('읽지 않은 메시지 개수 로드 실패:', error);
    }
  };

  return (
    <>
      <HeaderContainer isHome={isHome} scrolled={scrolled}>
        <HeaderContent>
          <Logo to="/">DevJobs</Logo>
          
          <Nav>
            <NavLink to="/jobs">채용정보</NavLink>
            {user?.role?.includes('INDIVIDUAL') && (
              <>
                <NavLink to="/mypage">마이페이지</NavLink>
                <NavLink to="/bookmarks">찜한공고</NavLink>
              </>
            )}
            {user?.role?.includes('COMPANY') && (
              <>
                <NavLink to="/mypage">마이페이지</NavLink>
                <NavLink to="/jobs/create">공고등록</NavLink>
              </>
            )}
            {user && (
              <NavLink to="/messages">
                쪽지함
                {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
              </NavLink>
            )}
            <NavLink to="/faq">FAQ</NavLink>
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
          
          <MobileMenuButton 
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>
      
      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileNavLink to="/jobs">채용정보</MobileNavLink>
        {user?.role?.includes('INDIVIDUAL') && (
          <>
            <MobileNavLink to="/mypage">마이페이지</MobileNavLink>
            <MobileNavLink to="/bookmarks">찜한공고</MobileNavLink>
          </>
        )}
        {user?.role?.includes('COMPANY') && (
          <>
            <MobileNavLink to="/mypage">마이페이지</MobileNavLink>
            <MobileNavLink to="/jobs/create">공고등록</MobileNavLink>
          </>
        )}
        {user && (
          <MobileNavLink to="/messages">
            쪽지함 {unreadCount > 0 && `(${unreadCount})`}
          </MobileNavLink>
        )}
        <MobileNavLink to="/faq">FAQ</MobileNavLink>
        
        <MobileUserSection>
          {user ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>
                {user.name || user.companyName || user.loginId || '사용자'}
              </div>
              <MobileButton className="secondary" onClick={handleLogout}>
                로그아웃
              </MobileButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <MobileButton className="secondary">로그인</MobileButton>
              </Link>
              <Link to="/signup">
                <MobileButton className="primary">회원가입</MobileButton>
              </Link>
            </>
          )}
        </MobileUserSection>
      </MobileMenu>
    </>
  );
};

export default Header;