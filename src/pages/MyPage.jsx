import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUser } from '../utils/auth';
import { jobAPI, applicationAPI, bookmarkAPI } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const Section = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 22px;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  h4 {
    color: #666;
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 5px;
  }
  
  p {
    color: #333;
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: #0066ff;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #0052cc;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f0f0f0;
  color: #333;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ApplicationCard = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  
  &:hover {
    border-color: #ccc;
  }
`;

const ApplicationInfo = styled.div`
  h4 {
    color: #333;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'APPLIED': return '#0066ff';
      case 'PASSED': return '#ffa500';
      case 'INTERVIEW': return '#9b59b6';
      case 'ACCEPTED': return '#22c55e';
      case 'REJECTED': return '#ff4444';
      default: return '#666';
    }
  }};
  color: white;
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  color: #ff4444;
  background: white;
  border: 1px solid #ff4444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: #ff4444;
    color: white;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    color: #999;
    border-color: #999;
  }
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const JobCard = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #0066ff;
    transform: translateY(-2px);
  }
  
  h4 {
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const JobCardButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const SmallButton = styled(Link)`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  
  h3 {
    color: #0066ff;
    font-size: 32px;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
  }
`;

const EmptyMessage = styled.p`
  color: #666;
  text-align: center;
  padding: 40px 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    fetchData(currentUser);
  }, [navigate]);

  const fetchData = async (currentUser) => {
    try {
      if (currentUser.role === 'ROLE_INDIVIDUAL') {
        // 개인 회원: 지원 목록 가져오기
        const data = await applicationAPI.getMyApplications();
        setApplications(data);
        // 북마크 개수 가져오기
        const bookmarkData = await bookmarkAPI.getBookmarkCount();
        setBookmarkCount(bookmarkData.count || 0);
      } else if (currentUser.role === 'ROLE_COMPANY') {
        // 기업 회원: 내 회사 채용공고 가져오기
        const myJobs = await jobAPI.getMyJobPostings();
        setCompanyJobs(myJobs);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPLIED': return '지원 완료';
      case 'PASSED': return '서류 통과';
      case 'INTERVIEW': return '면접';
      case 'ACCEPTED': return '최종 합격';
      case 'REJECTED': return '불합격';
      default: return status;
    }
  };

  const handleCancelApplication = async (applicationId) => {
    console.log('handleCancelApplication called with:', applicationId);
    
    // 이미 처리 중인 경우 무시
    if (cancelling) {
      console.log('Already cancelling, ignoring...');
      return;
    }
    
    if (!window.confirm('지원을 취소하시겠습니까?')) {
      return;
    }

    setCancelling(true);
    
    try {
      console.log('Calling cancelApplication API...');
      await applicationAPI.cancelApplication(applicationId);
      console.log('Cancel API call successful');
      alert('지원이 취소되었습니다.');
      
      // 목록 다시 불러오기
      if (user && user.role === 'ROLE_INDIVIDUAL') {
        console.log('Reloading applications...');
        const data = await applicationAPI.getMyApplications();
        setApplications(data);
      }
    } catch (error) {
      console.error('지원 취소 실패:', error);
      console.error('Error response:', error.response);
      alert('지원 취소에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  if (loading) {
    return (
      <Container>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </Container>
    );
  }

  if (!user) return null;

  // 개인 회원 마이페이지
  if (user.role === 'ROLE_INDIVIDUAL') {
    return (
      <Container>
        <Title>마이페이지</Title>
        
        <Section>
          <SectionTitle>내 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <h4>이름</h4>
              <p>{user.name}</p>
            </InfoItem>
            <InfoItem>
              <h4>이메일</h4>
              <p>{user.email}</p>
            </InfoItem>
            <InfoItem>
              <h4>아이디</h4>
              <p>{user.loginId}</p>
            </InfoItem>
          </InfoGrid>
          <ButtonGroup>
            <Button to="/profile/individual">프로필 관리</Button>
            <SecondaryButton to="/resume/upload">이력서 등록</SecondaryButton>
          </ButtonGroup>
        </Section>

        <Section>
          <SectionTitle>나의 활동</SectionTitle>
          <StatsGrid>
            <StatCard>
              <h3>{applications.length}</h3>
              <p>지원한 공고</p>
            </StatCard>
            <StatCard>
              <h3>{bookmarkCount}</h3>
              <p>찜한 공고</p>
            </StatCard>
          </StatsGrid>
          <ButtonGroup>
            <Button to="/bookmarks">찜한 공고 보기</Button>
          </ButtonGroup>
        </Section>

        <Section>
          <SectionTitle>지원 현황</SectionTitle>
          {applications.length === 0 ? (
            <EmptyMessage>아직 지원한 공고가 없습니다.</EmptyMessage>
          ) : (
            <ApplicationList>
              {applications.map(app => (
                <ApplicationCard key={app.applicationId}>
                  <ApplicationInfo>
                    <h4>{app.jobPostingTitle}</h4>
                    <p>{app.companyName} · 지원일: {formatDate(app.appliedAt)}</p>
                  </ApplicationInfo>
                  <StatusBadge status={app.status}>
                    {getStatusText(app.status)}
                  </StatusBadge>
                  {app.status === 'APPLIED' && (
                    <CancelButton 
                      onClick={() => handleCancelApplication(app.applicationId)}
                      disabled={cancelling}
                    >
                      {cancelling ? '취소 중...' : '지원 취소'}
                    </CancelButton>
                  )}
                </ApplicationCard>
              ))}
            </ApplicationList>
          )}
        </Section>
      </Container>
    );
  }

  // 기업 회원 마이페이지
  if (user.role === 'ROLE_COMPANY') {
    const activeJobs = companyJobs.filter(job => new Date(job.deadline) >= new Date());
    const closedJobs = companyJobs.filter(job => new Date(job.deadline) < new Date());

    return (
      <Container>
        <Title>기업 관리</Title>
        
        <Section>
          <SectionTitle>기업 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <h4>기업명</h4>
              <p>{user.companyName}</p>
            </InfoItem>
            <InfoItem>
              <h4>담당자</h4>
              <p>{user.name}</p>
            </InfoItem>
            <InfoItem>
              <h4>이메일</h4>
              <p>{user.email}</p>
            </InfoItem>
          </InfoGrid>
          <ButtonGroup>
            <Button to="/profile/company">기업정보 관리</Button>
            <SecondaryButton to="/jobs/create">채용공고 등록</SecondaryButton>
          </ButtonGroup>
        </Section>

        <Section>
          <SectionTitle>채용 현황</SectionTitle>
          <StatsGrid>
            <StatCard>
              <h3>{companyJobs.length}</h3>
              <p>전체 공고</p>
            </StatCard>
            <StatCard>
              <h3>{activeJobs.length}</h3>
              <p>진행중인 공고</p>
            </StatCard>
            <StatCard>
              <h3>{closedJobs.length}</h3>
              <p>마감된 공고</p>
            </StatCard>
          </StatsGrid>

          <SectionTitle>진행중인 채용공고</SectionTitle>
          {activeJobs.length === 0 ? (
            <EmptyMessage>진행중인 채용공고가 없습니다.</EmptyMessage>
          ) : (
            <JobList>
              {activeJobs.map(job => (
                <JobCard key={job.id}>
                  <h4>{job.title}</h4>
                  <p>마감일: {formatDate(job.deadline)}</p>
                  <p>{job.workLocation} · {formatSalary(job.salary)}</p>
                  <JobCardButtons>
                    <SmallButton to={`/jobs/${job.id}`} className="primary">
                      상세보기
                    </SmallButton>
                    <SmallButton to={`/jobs/${job.id}/edit`} className="secondary">
                      수정
                    </SmallButton>
                    <SmallButton to={`/jobs/${job.id}/applications`} className="secondary">
                      지원자 관리
                    </SmallButton>
                  </JobCardButtons>
                </JobCard>
              ))}
            </JobList>
          )}
        </Section>
      </Container>
    );
  }

  return null;
};

export default MyPage;