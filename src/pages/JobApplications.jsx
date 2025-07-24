import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI, applicationAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
  
  &:hover {
    color: #333;
  }
`;

const Header = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  h1 {
    color: #333;
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h3 {
    color: #0066ff;
    font-size: 28px;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const ApplicationList = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ApplicationItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9f9f9;
  }
`;

const ApplicantInfo = styled.div`
  flex: 1;
  
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
  margin-right: 15px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &.pass {
    background: #ffa500;
    color: white;
    
    &:hover:not(:disabled) {
      background: #ff8c00;
    }
  }
  
  &.accept {
    background: #22c55e;
    color: white;
    
    &:hover:not(:disabled) {
      background: #16a34a;
    }
  }
  
  &.reject {
    background: #ff4444;
    color: white;
    
    &:hover:not(:disabled) {
      background: #cc0000;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'ROLE_COMPANY') {
      alert('권한이 없습니다.');
      navigate('/');
      return;
    }

    fetchData();
  }, [id, navigate]);

  const fetchData = async () => {
    try {
      const [jobData, applicationsData] = await Promise.all([
        jobAPI.getJobDetail(id),
        applicationAPI.getJobApplications(id)
      ]);

      setJob(jobData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus);
      
      // 상태 업데이트
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      alert(`지원 상태가 ${getStatusText(newStatus)}(으)로 변경되었습니다.`);
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>지원자 목록을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  const appliedCount = applications.filter(app => app.status === 'APPLIED').length;
  const acceptedCount = applications.filter(app => app.status === 'ACCEPTED').length;
  const rejectedCount = applications.filter(app => app.status === 'REJECTED').length;

  return (
    <Container>
      <BackButton to="/mypage">← 마이페이지로 돌아가기</BackButton>
      
      <Header>
        <h1>{job?.title}</h1>
        <p>지원자 관리</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <h3>{applications.length}</h3>
          <p>전체 지원자</p>
        </StatCard>
        <StatCard>
          <h3>{appliedCount}</h3>
          <p>신규 지원</p>
        </StatCard>
        <StatCard>
          <h3>{acceptedCount}</h3>
          <p>합격</p>
        </StatCard>
        <StatCard>
          <h3>{rejectedCount}</h3>
          <p>불합격</p>
        </StatCard>
      </StatsGrid>

      <ApplicationList>
        {applications.length === 0 ? (
          <EmptyMessage>아직 지원자가 없습니다.</EmptyMessage>
        ) : (
          applications.map(app => (
            <ApplicationItem key={app.id}>
              <ApplicantInfo>
                <h4>{app.applicantName}</h4>
                <p>
                  {app.applicantEmail} · 지원일: {formatDate(app.appliedAt)}
                </p>
              </ApplicantInfo>
              
              <StatusBadge status={app.status}>
                {getStatusText(app.status)}
              </StatusBadge>
              
              {app.status === 'APPLIED' && (
                <ActionButtons>
                  <ActionButton
                    className="pass"
                    onClick={() => handleStatusUpdate(app.id, 'PASSED')}
                    disabled={updating}
                  >
                    서류 통과
                  </ActionButton>
                  <ActionButton
                    className="reject"
                    onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                    disabled={updating}
                  >
                    불합격
                  </ActionButton>
                </ActionButtons>
              )}
            </ApplicationItem>
          ))
        )}
      </ApplicationList>
    </Container>
  );
};

export default JobApplications;