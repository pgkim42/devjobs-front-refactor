import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { bookmarkAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const JobCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const JobLink = styled(Link)`
  display: block;
  color: inherit;
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ff6b6b;
  transition: all 0.2s;
  
  &:hover {
    color: #ff5252;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    font-size: 20px;
  }
`;

const JobTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
`;

const CompanyName = styled.p`
  color: #666;
  margin-bottom: 15px;
  font-size: 16px;
`;

const JobInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
`;

const InfoItem = styled.span`
  color: #555;
  font-size: 14px;
  
  &:before {
    content: '• ';
    color: #999;
  }
`;

const BookmarkedDate = styled.p`
  color: #999;
  font-size: 13px;
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 30px;
  }
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#0066ff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#0052cc' : '#f0f0f0'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 14px;
  }
`;

const BookmarkedJobs = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const user = getUser();

  useEffect(() => {
    fetchBookmarks();
    fetchBookmarkCount();
  }, [currentPage]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await bookmarkAPI.getMyBookmarks({
        page: currentPage,
        size: 12
      });
      
      setBookmarks(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('북마크 목록 로드 실패:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarkCount = async () => {
    try {
      const response = await bookmarkAPI.getBookmarkCount();
      setBookmarkCount(response.count || 0);
    } catch (error) {
      console.error('북마크 개수 로드 실패:', error);
    }
  };

  const handleBookmarkRemove = async (e, jobPostingId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('북마크를 제거하시겠습니까?')) {
      return;
    }

    try {
      await bookmarkAPI.toggleBookmark(jobPostingId);
      // 목록에서 즉시 제거
      setBookmarks(bookmarks.filter(bookmark => bookmark.jobPostingId !== jobPostingId));
      setBookmarkCount(prev => prev - 1);
    } catch (error) {
      console.error('북마크 제거 실패:', error);
      alert('북마크 제거 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatSalary = (salary) => {
    if (!salary) return '협의';
    if (salary >= 10000) {
      return `${(salary / 10000).toFixed(1)}억원`;
    }
    return `${salary.toLocaleString()}만원`;
  };

  if (!user || user.role !== 'ROLE_INDIVIDUAL') {
    return (
      <Container>
        <EmptyMessage>
          <h3>접근 권한이 없습니다</h3>
          <p>개인 회원만 북마크 기능을 사용할 수 있습니다.</p>
        </EmptyMessage>
      </Container>
    );
  }

  if (loading && bookmarks.length === 0) {
    return (
      <Container>
        <LoadingMessage>북마크 목록을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>내가 찜한 채용공고</Title>
        <Subtitle>총 {bookmarkCount}개의 채용공고를 북마크했습니다</Subtitle>
      </Header>
      
      {bookmarks.length === 0 ? (
        <EmptyMessage>
          <h3>북마크한 채용공고가 없습니다</h3>
          <p>마음에 드는 채용공고를 북마크해보세요!</p>
          <Link to="/jobs" style={{ marginTop: '20px', display: 'inline-block', color: '#0066ff' }}>
            채용공고 둘러보기 →
          </Link>
        </EmptyMessage>
      ) : (
        <>
          <JobGrid>
            {bookmarks.map(bookmark => (
              <JobCard key={bookmark.bookmarkId}>
                <BookmarkButton
                  onClick={(e) => handleBookmarkRemove(e, bookmark.jobPostingId)}
                  title="북마크 제거"
                >
                  ❤️
                </BookmarkButton>
                <JobLink to={`/jobs/${bookmark.jobPostingId}`}>
                  <JobTitle>{bookmark.title}</JobTitle>
                  <CompanyName>{bookmark.companyName}</CompanyName>
                  <JobInfo>
                    <InfoItem>{bookmark.workLocation}</InfoItem>
                    <InfoItem>{formatSalary(bookmark.salary)}</InfoItem>
                    <InfoItem>경력 {bookmark.requiredExperienceYears}년↑</InfoItem>
                  </JobInfo>
                  <BookmarkedDate>
                    북마크 일자: {formatDate(bookmark.bookmarkedAt)}
                  </BookmarkedDate>
                </JobLink>
              </JobCard>
            ))}
          </JobGrid>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
              >
                이전
              </PageButton>
              
              {[...Array(totalPages)].map((_, index) => (
                <PageButton
                  key={index}
                  active={index === currentPage}
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </PageButton>
              )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))}
              
              <PageButton 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default BookmarkedJobs;