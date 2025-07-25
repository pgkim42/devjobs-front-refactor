import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI, bookmarkAPI, categoryAPI } from '../api';
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

const SortSelect = styled.select`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
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
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid ${props => props.active ? '#0066ff' : '#ddd'};
  background: ${props => props.active ? '#0066ff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#0052cc' : '#f0f0f0'};
    border-color: #0066ff;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: #f5f5f5;
  }
  
  &.nav-button {
    padding: 0 12px;
    min-width: auto;
  }
  
  @media (max-width: 768px) {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
    padding: 0 6px;
  }
`;

const PageInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin: 0 16px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    margin: 10px 0;
    order: -1;
  }
`;

const PageEllipsis = styled.span`
  color: #999;
  padding: 0 8px;
  user-select: none;
`;

const FilterToggleButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? '#0066ff' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#0052cc' : '#e0e0e0'};
  }
  
  .badge {
    background: ${props => props.active ? 'rgba(255,255,255,0.3)' : '#0066ff'};
    color: ${props => props.active ? 'white' : 'white'};
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
`;

const FilterPanel = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const RangeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  
  @media (max-width: 768px) {
    justify-content: stretch;
    flex-direction: column;
  }
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f0f0f0;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchResultInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const ResultCount = styled.div`
  font-size: 16px;
  color: #333;
  
  strong {
    color: #0066ff;
    font-size: 20px;
    margin: 0 4px;
  }
`;

const SearchKeyword = styled.span`
  color: #666;
  font-style: italic;
`;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // 전체 공고 수
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [sortBy, setSortBy] = useState('createDate,desc'); // 기본값: 최신순
  const user = getUser();
  
  // 필터 상태
  const [filters, setFilters] = useState({
    location: '',
    minSalary: '',
    maxSalary: '',
    minExperience: '',
    maxExperience: '',
    jobCategoryId: ''
  });
  const [categories, setCategories] = useState([]); // 카테고리 목록
  const [isFiltersVisible, setIsFiltersVisible] = useState(false); // 필터 표시 여부

  useEffect(() => {
    fetchJobs();
  }, [currentPage, sortBy, filters]); // filters 추가
  
  useEffect(() => {
    // 카테고리 목록 가져오기
    fetchCategories();
  }, []);

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
  }, [user?.id]); // user 객체 대신 user.id만 의존성으로 사용

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // 필터 파라미터 준비
      const params = {
        page: currentPage,
        size: 12,
        keyword: keyword || undefined,
        sort: sortBy
      };
      
      // 필터 값들 추가 (빈 문자열은 제외)
      if (filters.location) params.location = filters.location;
      if (filters.minSalary) params.minSalary = parseInt(filters.minSalary);
      if (filters.maxSalary) params.maxSalary = parseInt(filters.maxSalary);
      if (filters.minExperience) params.minExperience = parseInt(filters.minExperience);
      if (filters.maxExperience) params.maxExperience = parseInt(filters.maxExperience);
      if (filters.jobCategoryId) params.jobCategoryId = parseInt(filters.jobCategoryId);
      
      const response = await jobAPI.getJobListWithPageInfo(params);
      
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('채용공고 로드 실패:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    setShowSuggestions(false);
    fetchJobs();
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(0); // 정렬 변경 시 첫 페이지로 이동
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  };
  
  const resetFilters = () => {
    setFilters({
      location: '',
      minSalary: '',
      maxSalary: '',
      minExperience: '',
      maxExperience: '',
      jobCategoryId: ''
    });
    setCurrentPage(0);
  };
  
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };
  
  // 지역 목록 (실제로는 API에서 가져올 수도 있음)
  const locations = [
    '전체',
    '서울', '경기', '인천', '부산', '대구', '대전', 
    '광주', '울산', '세종', '강원', '충북', '충남', 
    '전북', '전남', '경북', '경남', '제주'
  ];

  // 페이지 번호 생성 로직
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 10; // 한 번에 보여줄 최대 페이지 수
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(0, currentPage - halfRange);
    let endPage = Math.min(totalPages - 1, currentPage + halfRange);
    
    // 시작 부분에서 페이지가 부족한 경우 끝쪽에 더 표시
    if (currentPage < halfRange) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    }
    
    // 끝 부분에서 페이지가 부족한 경우 시작쪽에 더 표시
    if (currentPage > totalPages - halfRange - 1) {
      startPage = Math.max(0, totalPages - maxPagesToShow);
    }
    
    // 첫 페이지
    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push('...');
      }
    }
    
    // 중간 페이지들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // 마지막 페이지
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages - 1);
    }
    
    return pages;
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
        <SortSelect value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="createDate,desc">최신순</option>
          <option value="viewCount,desc">조회수순</option>
          <option value="deadline,asc">마감일순</option>
          <option value="salary,desc">연봉 높은순</option>
          <option value="salary,asc">연봉 낮은순</option>
        </SortSelect>
        <FilterToggleButton 
          active={isFiltersVisible}
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          상세 필터
          {hasActiveFilters() && <span className="badge">{Object.values(filters).filter(v => v !== '').length}</span>}
        </FilterToggleButton>
      </FilterSection>
      
      {isFiltersVisible && (
        <FilterPanel>
          <FilterGrid>
            {/* 지역 필터 */}
            <FilterGroup>
              <FilterLabel>근무지역</FilterLabel>
              <FilterSelect
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">전체</option>
                {locations.slice(1).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            {/* 경력 필터 */}
            <FilterGroup>
              <FilterLabel>경력</FilterLabel>
              <RangeInputGroup>
                <FilterSelect
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                >
                  <option value="">최소</option>
                  {[0, 1, 2, 3, 5, 7, 10].map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </FilterSelect>
                <span>~</span>
                <FilterSelect
                  value={filters.maxExperience}
                  onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
                >
                  <option value="">최대</option>
                  {[1, 2, 3, 5, 7, 10, 15].map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </FilterSelect>
              </RangeInputGroup>
            </FilterGroup>
            
            {/* 연봉 필터 */}
            <FilterGroup>
              <FilterLabel>연봉 (만원)</FilterLabel>
              <RangeInputGroup>
                <FilterInput
                  type="number"
                  placeholder="최소"
                  value={filters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                />
                <span>~</span>
                <FilterInput
                  type="number"
                  placeholder="최대"
                  value={filters.maxSalary}
                  onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                />
              </RangeInputGroup>
            </FilterGroup>
            
            {/* 직무 카테고리 필터 */}
            <FilterGroup>
              <FilterLabel>직무 카테고리</FilterLabel>
              <FilterSelect
                value={filters.jobCategoryId}
                onChange={(e) => handleFilterChange('jobCategoryId', e.target.value)}
              >
                <option value="">전체</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
          
          <FilterActions>
            <ResetButton onClick={resetFilters}>
              필터 초기화
            </ResetButton>
          </FilterActions>
        </FilterPanel>
      )}
      
      {/* 검색 결과 정보 */}
      {!loading && (
        <SearchResultInfo>
          <ResultCount>
            전체 <strong>{totalElements}</strong>개의 채용공고
            {(keyword || hasActiveFilters()) && (
              <SearchKeyword>
                {keyword && ` "${keyword}" 검색 결과`}
                {hasActiveFilters() && ' (필터 적용됨)'}
              </SearchKeyword>
            )}
          </ResultCount>
        </SearchResultInfo>
      )}
      
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
                    <InfoItem>조회수 {job.viewCount || 0}</InfoItem>
                  </JobInfo>
                  <Deadline>마감일: {formatDate(job.deadline)}</Deadline>
                </JobLink>
              </JobCard>
            ))}
          </JobGrid>
          
          {totalPages > 1 && (
            <Pagination>
              {/* 첫 페이지 버튼 */}
              <PageButton 
                className="nav-button"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                title="첫 페이지"
              >
                &laquo;
              </PageButton>
              
              {/* 이전 페이지 버튼 */}
              <PageButton 
                className="nav-button"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
                title="이전 페이지"
              >
                &lsaquo;
              </PageButton>
              
              {/* 페이지 번호들 */}
              {generatePageNumbers().map((page, index) => (
                page === '...' ? (
                  <PageEllipsis key={`ellipsis-${index}`}>...</PageEllipsis>
                ) : (
                  <PageButton
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    title={`${page + 1} 페이지`}
                  >
                    {page + 1}
                  </PageButton>
                )
              ))}
              
              {/* 다음 페이지 버튼 */}
              <PageButton 
                className="nav-button"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages - 1}
                title="다음 페이지"
              >
                &rsaquo;
              </PageButton>
              
              {/* 마지막 페이지 버튼 */}
              <PageButton 
                className="nav-button"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                title="마지막 페이지"
              >
                &raquo;
              </PageButton>
              
              {/* 페이지 정보 */}
              <PageInfo>
                {currentPage + 1} / {totalPages} 페이지
              </PageInfo>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default JobList;