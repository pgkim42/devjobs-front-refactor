import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminAPI } from '../../api';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  min-width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 0.5rem;
  flex: 1;
`;

const StatusSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
`;

const BackLink = styled(Link)`
  text-decoration: none;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const Th = styled.th`
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9f9f9;
  }
`;

const JobLink = styled(Link)`
  color: #1976d2;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  background: ${props => {
    switch(props.status) {
      case 'ACTIVE': return '#4caf50';
      case 'CLOSED': return '#ff9800';
      case 'CANCELLED': return '#f44336';
      case 'FILLED': return '#9c27b0';
      default: return '#666';
    }
  }};
  color: white;
`;

const DeleteButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #d32f2f;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #f44336;
`;

const JobPostingManagement = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchJobPostings();
  }, [page, search, status]);

  const fetchJobPostings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        size: 20,
        sort: 'id,desc'
      };
      
      if (search) {
        params.search = search;
      }
      
      if (status) {
        params.status = status;
      }
      
      const response = await adminAPI.getJobPostings(params);
      setJobPostings(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch job postings:', err);
      setError('채용공고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobPostings();
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) {
      return;
    }

    setDeletingId(jobId);
    
    try {
      await adminAPI.deleteJobPosting(jobId);
      alert('채용공고가 삭제되었습니다.');
      fetchJobPostings();
    } catch (err) {
      console.error('Failed to delete job posting:', err);
      alert('채용공고 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ACTIVE': return '진행중';
      case 'CLOSED': return '마감';
      case 'CANCELLED': return '취소';
      case 'FILLED': return '채용완료';
      default: return status;
    }
  };

  return (
    <Container>
      <BackLink to="/admin">
        <FaChevronLeft /> 관리자 대시보드로 돌아가기
      </BackLink>
      
      <Header>
        <Title>채용공고 관리</Title>
        <FilterContainer>
          <StatusSelect value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="ACTIVE">진행중</option>
            <option value="CLOSED">마감</option>
            <option value="CANCELLED">취소</option>
            <option value="FILLED">채용완료</option>
          </StatusSelect>
          <form onSubmit={handleSearch}>
            <SearchContainer>
              <FaSearch />
              <SearchInput
                type="text"
                placeholder="제목, 회사명으로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchContainer>
          </form>
        </FilterContainer>
      </Header>

      {loading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>제목</Th>
                  <Th>회사명</Th>
                  <Th>카테고리</Th>
                  <Th>지역</Th>
                  <Th>경력</Th>
                  <Th>급여</Th>
                  <Th>마감일</Th>
                  <Th>상태</Th>
                  <Th>지원자</Th>
                  <Th>등록일</Th>
                  <Th>작업</Th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.length === 0 ? (
                  <tr>
                    <Td colSpan="12" style={{ textAlign: 'center' }}>
                      검색 결과가 없습니다.
                    </Td>
                  </tr>
                ) : (
                  jobPostings.map((job) => (
                    <Tr key={job.id}>
                      <Td>{job.id}</Td>
                      <Td>
                        <JobLink to={`/jobs/${job.id}`} target="_blank">
                          {job.title}
                        </JobLink>
                      </Td>
                      <Td>{job.companyName}</Td>
                      <Td>{job.categoryName || '-'}</Td>
                      <Td>{job.workLocation}</Td>
                      <Td>{job.requiredExperienceYears}년</Td>
                      <Td>{job.salary ? `${job.salary.toLocaleString()}만원` : '-'}</Td>
                      <Td>{formatDate(job.deadline)}</Td>
                      <Td>
                        <StatusBadge status={job.status}>
                          {getStatusText(job.status)}
                        </StatusBadge>
                      </Td>
                      <Td>{job.applicationCount || 0}명</Td>
                      <Td>{formatDate(job.createdAt)}</Td>
                      <Td>
                        <DeleteButton
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                        >
                          <FaTrash />
                          {deletingId === job.id ? '삭제 중...' : '삭제'}
                        </DeleteButton>
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <FaChevronLeft />
              </PageButton>
              
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const pageNum = Math.max(0, Math.min(page - 4, totalPages - 10)) + i;
                if (pageNum < totalPages) {
                  return (
                    <PageButton
                      key={pageNum}
                      active={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </PageButton>
                  );
                }
                return null;
              })}
              
              <PageButton
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                <FaChevronRight />
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default JobPostingManagement;