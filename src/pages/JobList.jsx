import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI, bookmarkAPI } from '../api';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const CreateButton = styled(Link)`
  background: #0066ff;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
  text-align: center;
  
  &:hover {
    background: #0052cc;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const AutocompleteDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const AutocompleteItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const HighlightedText = styled.span`
  color: #0066ff;
  font-weight: 600;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #0052cc;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
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
  color: ${props => props.isBookmarked ? '#ff6b6b' : '#ddd'};
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.isBookmarked ? '#ff5252' : '#999'};
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

const Deadline = styled.p`
  color: #999;
  font-size: 14px;
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

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const user = getUser();

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  useEffect(() => {
    // cleanup: 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

  useEffect(() => {
    // 로그인한 개인 회원인 경우 북마크 목록 가져오기
    if (user && user.role === 'ROLE_INDIVIDUAL') {
      fetchBookmarkedIds();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobListWithPageInfo({
        page: currentPage,
        size: 12,
        keyword: keyword || undefined
      });
      
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('채용공고 로드 실패:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setShowSuggestions(false);
    fetchJobs();
  };

  const fetchSuggestions = async (searchKeyword) => {
    if (!searchKeyword || searchKeyword.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await jobAPI.getJobListWithPageInfo({
        page: 0,
        size: 5,
        keyword: searchKeyword
      });
      
      const uniqueSuggestions = [];
      const seen = new Set();
      
      response.content?.forEach(job => {
        // 회사명 추가
        if (!seen.has(job.companyName) && job.companyName.toLowerCase().includes(searchKeyword.toLowerCase())) {
          seen.add(job.companyName);
          uniqueSuggestions.push({
            type: 'company',
            value: job.companyName,
            display: job.companyName
          });
        }
        
        // 직무명 추가 (제목에서 추출)
        if (!seen.has(job.title) && job.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
          seen.add(job.title);
          uniqueSuggestions.push({
            type: 'job',
            value: job.title,
            display: job.title
          });
        }
      });
      
      setSuggestions(uniqueSuggestions.slice(0, 5));
    } catch (error) {
      console.error('자동완성 데이터 로드 실패:', error);
      setSuggestions([]);
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    
    // 이전 타이머 취소
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // 새로운 타이머 설정 (300ms 디바운스)
    const newTimer = setTimeout(() => {
      fetchSuggestions(value);
      setShowSuggestions(true);
    }, 300);
    
    setSearchDebounceTimer(newTimer);
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion.value);
    setShowSuggestions(false);
    setCurrentPage(0);
    fetchJobs();
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <HighlightedText key={index}>{part}</HighlightedText> 
        : part
    );
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

  const fetchBookmarkedIds = async () => {
    try {
      const ids = await bookmarkAPI.getBookmarkedIds();
      setBookmarkedIds(ids);
    } catch (error) {
      console.error('북마크 목록 로드 실패:', error);
    }
  };

  const handleBookmarkToggle = async (e, jobId) => {
    e.preventDefault(); // 링크 클릭 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    
    if (!user || user.role !== 'ROLE_INDIVIDUAL') {
      alert('개인 회원만 북마크를 사용할 수 있습니다.');
      return;
    }

    try {
      const result = await bookmarkAPI.toggleBookmark(jobId);
      
      if (result.isBookmarked) {
        setBookmarkedIds([...bookmarkedIds, jobId]);
      } else {
        setBookmarkedIds(bookmarkedIds.filter(id => id !== jobId));
      }
      
      // 토스트 메시지 대신 console.log 사용 (간단하게)
      console.log(result.message);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <Container>
        <LoadingMessage>채용공고를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>채용 정보</Title>
        {user?.role === 'ROLE_COMPANY' && (
          <CreateButton to="/jobs/create">채용공고 등록</CreateButton>
        )}
      </Header>
      
      <FilterSection>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="회사명, 직무명으로 검색하세요"
            value={keyword}
            onChange={handleKeywordChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => keyword.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <AutocompleteDropdown>
              {suggestions.map((suggestion, index) => (
                <AutocompleteItem
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {highlightMatch(suggestion.display, keyword)}
                </AutocompleteItem>
              ))}
            </AutocompleteDropdown>
          )}
        </SearchWrapper>
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </FilterSection>
      
      {jobs.length === 0 ? (
        <EmptyMessage>
          <h3>등록된 채용공고가 없습니다</h3>
          <p>곧 새로운 채용 정보가 업데이트될 예정입니다.</p>
        </EmptyMessage>
      ) : (
        <>
          <JobGrid>
            {jobs.map(job => (
              <JobCard key={job.id}>
                {user && user.role === 'ROLE_INDIVIDUAL' && (
                  <BookmarkButton
                    isBookmarked={bookmarkedIds.includes(job.id)}
                    onClick={(e) => handleBookmarkToggle(e, job.id)}
                  >
                    {bookmarkedIds.includes(job.id) ? '❤️' : '🤍'}
                  </BookmarkButton>
                )}
                <JobLink to={`/jobs/${job.id}`}>
                  <JobTitle>{job.title}</JobTitle>
                  <CompanyName>{job.companyName}</CompanyName>
                  <JobInfo>
                    <InfoItem>{job.workLocation}</InfoItem>
                    <InfoItem>{formatSalary(job.salary)}</InfoItem>
                    <InfoItem>경력 {job.requiredExperienceYears}년↑</InfoItem>
                  </JobInfo>
                  <Deadline>마감일: {formatDate(job.deadline)}</Deadline>
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

export default JobList;