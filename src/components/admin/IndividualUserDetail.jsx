import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { adminAPI } from '../../api';
import { FaChevronLeft } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackLink = styled(Link)`
  text-decoration: none;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Value = styled.span`
  color: #333;
  font-size: 1rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  background: ${props => props.active ? '#4caf50' : '#f44336'};
  color: white;
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

const IndividualUserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getIndividualUser(userId);
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink to="/admin/users/individual">
          <FaChevronLeft /> 목록으로 돌아가기
        </BackLink>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <ErrorMessage>사용자를 찾을 수 없습니다.</ErrorMessage>
        <BackLink to="/admin/users/individual">
          <FaChevronLeft /> 목록으로 돌아가기
        </BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink to="/admin/users/individual">
        <FaChevronLeft /> 개인회원 목록으로 돌아가기
      </BackLink>
      
      <ContentCard>
        <Title>개인회원 상세 정보</Title>
        
        <InfoSection>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>회원 ID</Label>
              <Value>{user.userId}</Value>
            </InfoItem>
            <InfoItem>
              <Label>로그인 ID</Label>
              <Value>{user.loginId}</Value>
            </InfoItem>
            <InfoItem>
              <Label>이름</Label>
              <Value>{user.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>이메일</Label>
              <Value>{user.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>전화번호</Label>
              <Value>{user.phone || '-'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>주소</Label>
              <Value>{user.address || '-'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>성별</Label>
              <Value>{user.gender || '-'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>생년월일</Label>
              <Value>{user.birthDate ? formatDate(user.birthDate) : '-'}</Value>
            </InfoItem>
          </InfoGrid>
        </InfoSection>

        <InfoSection>
          <SectionTitle>활동 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>지원 횟수</Label>
              <Value>{user.applicationCount || 0}건</Value>
            </InfoItem>
            <InfoItem>
              <Label>가입일</Label>
              <Value>{formatDate(user.createdAt)}</Value>
            </InfoItem>
            <InfoItem>
              <Label>마지막 로그인</Label>
              <Value>{user.lastLoginAt ? formatDate(user.lastLoginAt) : '-'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>계정 상태</Label>
              <Value>
                <StatusBadge active={user.isActive}>
                  {user.isActive ? '활성' : '비활성'}
                </StatusBadge>
              </Value>
            </InfoItem>
          </InfoGrid>
        </InfoSection>
      </ContentCard>
    </Container>
  );
};

export default IndividualUserDetail;