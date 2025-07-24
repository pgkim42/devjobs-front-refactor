import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI, applicationAPI, bookmarkAPI, messageAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 1000px;
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

const JobHeader = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: ${props => props.isBookmarked ? '#ff6b6b' : '#ddd'};
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.isBookmarked ? '#ff5252' : '#999'};
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 28px;
    top: 20px;
    right: 20px;
  }
`;

const JobTitle = styled.h1`
  color: #333;
  margin-bottom: 15px;
  font-size: 28px;
`;

const CompanyName = styled.h2`
  color: #666;
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  h4 {
    color: #999;
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 5px;
  }
  
  p {
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
`;

const ContentSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  h3 {
    color: #333;
    margin-bottom: 20px;
  }
  
  p {
    color: #555;
    line-height: 1.8;
    white-space: pre-wrap;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ApplyButton = styled(Button)`
  background: #0066ff;
  color: white;
  
  &:hover:not(:disabled) {
    background: #0052cc;
  }
`;

const EditButton = styled(Button)`
  background: #f0f0f0;
  color: #333;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const InquiryButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const DeleteButton = styled(Button)`
  background: #ff4444;
  color: white;
  
  &:hover:not(:disabled) {
    background: #cc0000;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff0000;
  padding: 60px 20px;
  font-size: 18px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => props.closed ? '#ff4444' : '#22c55e'};
  color: white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
  
  h2 {
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &.primary {
    background: #0066ff;
    color: white;
    
    &:hover:not(:disabled) {
      background: #0052cc;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const user = getUser();

  useEffect(() => {
    fetchJobDetail();
    if (user && user.role === 'ROLE_INDIVIDUAL') {
      checkBookmarkStatus();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const data = await jobAPI.getJobDetail(id);
      setJob(data);
    } catch (error) {
      console.error('채용공고 로드 실패:', error);
      setError('채용공고를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (user.role !== 'ROLE_INDIVIDUAL') {
      alert('개인 회원만 지원할 수 있습니다.');
      return;
    }

    setApplying(true);
    try {
      await applicationAPI.apply(parseInt(id));
      alert('지원이 완료되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('지원 실패:', error);
      alert(error.response?.data?.message || '지원에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  const handleEdit = () => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await jobAPI.deleteJob(id);
      alert('채용공고가 삭제되었습니다.');
      navigate('/jobs');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const result = await bookmarkAPI.checkBookmark(id);
      setIsBookmarked(result.isBookmarked);
    } catch (error) {
      console.error('북마크 상태 확인 실패:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user || user.role !== 'ROLE_INDIVIDUAL') {
      alert('개인 회원만 북마크를 사용할 수 있습니다.');
      return;
    }

    try {
      const result = await bookmarkAPI.toggleBookmark(id);
      setIsBookmarked(result.isBookmarked);
      // 토스트 메시지 대신 console.log 사용
      console.log(result.message);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
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

  const isJobClosed = () => {
    return new Date(job.deadline) < new Date();
  };

  const handleInquiry = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setShowInquiryModal(true);
    setMessageContent('');
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    setSendingMessage(true);
    try {
      await messageAPI.sendMessage({
        receiverId: job.companyInfo.companyId,
        content: messageContent,
        jobPostingId: parseInt(id)
      });
      alert('문의가 전송되었습니다.');
      setShowInquiryModal(false);
      setMessageContent('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('문의 전송에 실패했습니다.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>채용공고를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container>
        <ErrorMessage>{error || '채용공고를 찾을 수 없습니다.'}</ErrorMessage>
      </Container>
    );
  }

  // companyInfo.companyId와 user.userId 비교
  const isOwner = user?.role === 'ROLE_COMPANY' && 
                  job.companyInfo?.companyId === user.userId;

  return (
    <Container>
      <BackButton to="/jobs">← 목록으로 돌아가기</BackButton>
      
      <JobHeader>
        {user && user.role === 'ROLE_INDIVIDUAL' && (
          <BookmarkButton
            isBookmarked={isBookmarked}
            onClick={handleBookmarkToggle}
          >
            {isBookmarked ? '❤️' : '🤍'}
          </BookmarkButton>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <JobTitle>{job.title}</JobTitle>
            <CompanyName>{job.companyInfo?.companyName}</CompanyName>
          </div>
          <StatusBadge closed={isJobClosed()}>
            {isJobClosed() ? '마감' : '지원가능'}
          </StatusBadge>
        </div>
        
        <InfoGrid>
          <InfoItem>
            <h4>근무지</h4>
            <p>{job.workLocation}</p>
          </InfoItem>
          <InfoItem>
            <h4>급여</h4>
            <p>{formatSalary(job.salary)}</p>
          </InfoItem>
          <InfoItem>
            <h4>경력 요구사항</h4>
            <p>{job.requiredExperienceYears}년 이상</p>
          </InfoItem>
          <InfoItem>
            <h4>마감일</h4>
            <p>{formatDate(job.deadline)}</p>
          </InfoItem>
        </InfoGrid>
      </JobHeader>

      <ContentSection>
        <h3>상세 내용</h3>
        <p>{job.content}</p>
      </ContentSection>

      <ButtonContainer>
        {isOwner ? (
          <>
            <EditButton onClick={handleEdit}>수정하기</EditButton>
            <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
          </>
        ) : (
          <>
            {user?.role === 'ROLE_INDIVIDUAL' && (
              <>
                <ApplyButton 
                  onClick={handleApply} 
                  disabled={applying || isJobClosed()}
                >
                  {applying ? '지원 중...' : isJobClosed() ? '마감됨' : '지원하기'}
                </ApplyButton>
                <InquiryButton onClick={handleInquiry}>
                  문의하기
                </InquiryButton>
              </>
            )}
          </>
        )}
      </ButtonContainer>
      
      {showInquiryModal && (
        <ModalOverlay onClick={() => setShowInquiryModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>채용 문의</h2>
              <p>{job.companyInfo?.companyName}에게 문의 메시지를 보냅니다.</p>
            </ModalHeader>
            
            <MessageTextarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="문의 내용을 입력해주세요."
              maxLength={1000}
              autoFocus
            />
            
            <ModalButtons>
              <ModalButton 
                className="secondary" 
                onClick={() => setShowInquiryModal(false)}
              >
                취소
              </ModalButton>
              <ModalButton 
                className="primary" 
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageContent.trim()}
              >
                {sendingMessage ? '전송 중...' : '보내기'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default JobDetail;