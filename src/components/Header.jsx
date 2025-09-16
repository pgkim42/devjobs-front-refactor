import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { messageAPI } from '../api';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenuOutline, IoCloseOutline, IoNotificationsOutline } from 'react-icons/io5';
import { cn } from '../utils/cn';


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

  const headerClasses = cn(
    "sticky top-0 z-50 transition-all duration-200",
    isHome && !scrolled
      ? "bg-transparent"
      : isHome && scrolled
        ? "bg-white/80 backdrop-blur-lg border-b border-gray-200"
        : "bg-white border-b border-gray-200"
  );

  return (
    <>
      <motion.header
        className={headerClasses}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-4 flex justify-between items-center h-16">
          <Link
            to="/"
            className="font-bold text-2xl text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors duration-150"
          >
            DevJobs
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/jobs"
              className={cn(
                "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                location.pathname.startsWith('/jobs') && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
              )}
            >
              채용정보
            </Link>

            {user?.role?.includes('INDIVIDUAL') && (
              <>
                <Link
                  to="/mypage"
                  className={cn(
                    "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                    location.pathname === '/mypage' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                  )}
                >
                  마이페이지
                </Link>
                <Link
                  to="/bookmarks"
                  className={cn(
                    "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                    location.pathname === '/bookmarks' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                  )}
                >
                  찜한공고
                </Link>
              </>
            )}

            {user?.role?.includes('COMPANY') && (
              <>
                <Link
                  to="/mypage"
                  className={cn(
                    "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                    location.pathname === '/mypage' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                  )}
                >
                  마이페이지
                </Link>
                <Link
                  to="/jobs/create"
                  className={cn(
                    "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                    location.pathname === '/jobs/create' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                  )}
                >
                  공고등록
                </Link>
              </>
            )}

            {user?.role?.includes('ADMIN') && (
              <Link
                to="/admin"
                className={cn(
                  "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                  location.pathname.startsWith('/admin') && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                )}
              >
                관리자
              </Link>
            )}

            {user && (
              <Link
                to="/messages"
                className={cn(
                  "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded flex items-center gap-1",
                  location.pathname === '/messages' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
                )}
              >
                <IoNotificationsOutline size={20} />
                쪽지함
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[18px] text-center leading-none"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}

            <Link
              to="/faq"
              className={cn(
                "font-medium text-base text-gray-900 hover:text-primary-600 py-2 relative transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
                location.pathname === '/faq' && "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full"
              )}
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  {user.name || user.companyName || user.loginId || '사용자'}
                </span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">로그인</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>

          <motion.button
            className="md:hidden flex items-center justify-center p-2 text-gray-900 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 backdrop-blur-lg z-40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="max-w-6xl mx-auto px-4 py-6">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              >
                채용정보
              </Link>

              {user?.role?.includes('INDIVIDUAL') && (
                <>
                  <Link
                    to="/mypage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    마이페이지
                  </Link>
                  <Link
                    to="/bookmarks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    찜한공고
                  </Link>
                </>
              )}

              {user?.role?.includes('COMPANY') && (
                <>
                  <Link
                    to="/mypage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    마이페이지
                  </Link>
                  <Link
                    to="/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    공고등록
                  </Link>
                </>
              )}

              {user?.role?.includes('ADMIN') && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                >
                  관리자
                </Link>
              )}

              {user && (
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 border-b border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <IoNotificationsOutline size={20} />
                    쪽지함
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[18px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              )}

              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-lg text-gray-900 hover:text-primary-600 py-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              >
                FAQ
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="text-center text-base text-gray-600 mb-2">
                      {user.name || user.companyName || user.loginId || '사용자'}
                    </div>
                    <Button variant="secondary" fullWidth onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="secondary" fullWidth>로그인</Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="primary" fullWidth>회원가입</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;