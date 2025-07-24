import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
`;

const CreateButton = styled(Link)`
  background: #0066ff;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #0052cc;
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
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
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
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const JobCard = styled(Link)`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
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
`;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const user = getUser();

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

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
    fetchJobs();
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
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
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
              <JobCard key={job.id} to={`/jobs/${job.id}`}>
                <JobTitle>{job.title}</JobTitle>
                <CompanyName>{job.companyName}</CompanyName>
                <JobInfo>
                  <InfoItem>{job.workLocation}</InfoItem>
                  <InfoItem>{formatSalary(job.salary)}</InfoItem>
                  <InfoItem>경력 {job.requiredExperienceYears}년↑</InfoItem>
                </JobInfo>
                <Deadline>마감일: {formatDate(job.deadline)}</Deadline>
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