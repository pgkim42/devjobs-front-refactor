import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminAPI } from '../../api';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  min-width: 900px;
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

const CompanyLink = styled(Link)`
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
  background: ${props => props.active ? '#4caf50' : '#f44336'};
  color: white;
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

const CompanyUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
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
      
      const response = await adminAPI.getCompanyUsers(params);
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <Container>
      <BackLink to="/admin">
        <FaChevronLeft /> 관리자 대시보드로 돌아가기
      </BackLink>
      
      <Header>
        <Title>기업회원 관리</Title>
        <form onSubmit={handleSearch}>
          <SearchContainer>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="회사명, 담당자명, 이메일로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchContainer>
        </form>
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
                  <Th>아이디</Th>
                  <Th>회사명</Th>
                  <Th>사업자번호</Th>
                  <Th>대표자</Th>
                  <Th>담당자</Th>
                  <Th>이메일</Th>
                  <Th>연락처</Th>
                  <Th>공고 수</Th>
                  <Th>가입일</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <Td colSpan="11" style={{ textAlign: 'center' }}>
                      검색 결과가 없습니다.
                    </Td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <Tr key={user.userId}>
                      <Td>{user.userId}</Td>
                      <Td>
                        <CompanyLink to={`/admin/users/company/${user.userId}`}>
                          {user.loginId}
                        </CompanyLink>
                      </Td>
                      <Td>{user.companyName}</Td>
                      <Td>{user.businessNumber}</Td>
                      <Td>{user.ceoName}</Td>
                      <Td>{user.contactPersonName}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.contactPhone || '-'}</Td>
                      <Td>{user.jobPostingCount || 0}</Td>
                      <Td>{formatDate(user.createdAt)}</Td>
                      <Td>
                        <StatusBadge active={user.isActive}>
                          {user.isActive ? '활성' : '비활성'}
                        </StatusBadge>
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

export default CompanyUserList;