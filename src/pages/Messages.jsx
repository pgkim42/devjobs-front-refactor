import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { messageAPI } from '../api';
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
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0066ff' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#0066ff' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #0066ff;
  }
`;

const MessageList = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MessageItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
`;

const MessageInfo = styled.div`
  flex: 1;
`;

const SenderName = styled.h4`
  color: #333;
  font-weight: ${props => props.unread ? '600' : '400'};
  margin-bottom: 5px;
`;

const JobTitle = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
`;

const MessagePreview = styled.p`
  color: ${props => props.unread ? '#333' : '#666'};
  font-weight: ${props => props.unread ? '500' : '400'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MessageDate = styled.span`
  color: #999;
  font-size: 14px;
  white-space: nowrap;
`;

const UnreadBadge = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #0066ff;
  border-radius: 50%;
  margin-left: 10px;
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
  margin-top: 30px;
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

const MessageContent = styled.div`
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 20px 0;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Messages = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = getUser();

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [activeTab, currentPage]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'received') {
        response = await messageAPI.getReceivedMessages({ page: currentPage, size: 20 });
      } else {
        response = await messageAPI.getSentMessages({ page: currentPage, size: 20 });
      }
      
      setMessages(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('읽지 않은 메시지 개수 로드 실패:', error);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    
    // 받은 메시지이고 읽지 않은 경우 읽음 처리
    if (activeTab === 'received' && !message.isRead) {
      try {
        await messageAPI.markAsRead(message.messageId);
        // 목록 업데이트
        setMessages(messages.map(m => 
          m.messageId === message.messageId ? { ...m, isRead: true } : m
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('읽음 처리 실패:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}일 전`;
    
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <Container>
        <EmptyMessage>
          <h3>로그인이 필요합니다</h3>
          <p>쪽지함을 이용하려면 로그인해주세요.</p>
        </EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>쪽지함</Title>
      </Header>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'received'} 
          onClick={() => { setActiveTab('received'); setCurrentPage(0); }}
        >
          받은 쪽지함 {unreadCount > 0 && `(${unreadCount})`}
        </Tab>
        <Tab 
          active={activeTab === 'sent'} 
          onClick={() => { setActiveTab('sent'); setCurrentPage(0); }}
        >
          보낸 쪽지함
        </Tab>
      </TabContainer>
      
      {loading ? (
        <LoadingMessage>메시지를 불러오는 중...</LoadingMessage>
      ) : messages.length === 0 ? (
        <EmptyMessage>
          <h3>{activeTab === 'received' ? '받은 쪽지가 없습니다' : '보낸 쪽지가 없습니다'}</h3>
        </EmptyMessage>
      ) : (
        <>
          <MessageList>
            {messages.map(message => (
              <MessageItem 
                key={message.messageId}
                onClick={() => handleMessageClick(message)}
              >
                <MessageHeader>
                  <MessageInfo>
                    <SenderName unread={activeTab === 'received' && !message.isRead}>
                      {activeTab === 'received' 
                        ? `${message.senderName} (${message.senderLoginId})`
                        : `${message.receiverName} (${message.receiverLoginId})`
                      }
                      {activeTab === 'received' && !message.isRead && <UnreadBadge />}
                    </SenderName>
                    {message.jobPostingTitle && (
                      <JobTitle>채용공고: {message.jobPostingTitle}</JobTitle>
                    )}
                    <MessagePreview unread={activeTab === 'received' && !message.isRead}>
                      {message.content}
                    </MessagePreview>
                  </MessageInfo>
                  <MessageDate>{formatDate(message.createdAt)}</MessageDate>
                </MessageHeader>
              </MessageItem>
            ))}
          </MessageList>
          
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
      
      {selectedMessage && (
        <ModalOverlay onClick={() => setSelectedMessage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>쪽지 상세</h2>
              <CloseButton onClick={() => setSelectedMessage(null)}>×</CloseButton>
            </ModalHeader>
            
            <MessageMeta>
              <div>
                <div>보낸 사람: {selectedMessage.senderName} ({selectedMessage.senderLoginId})</div>
                <div>받는 사람: {selectedMessage.receiverName} ({selectedMessage.receiverLoginId})</div>
                {selectedMessage.jobPostingTitle && (
                  <div>관련 공고: {selectedMessage.jobPostingTitle}</div>
                )}
              </div>
              <div>{new Date(selectedMessage.createdAt).toLocaleString()}</div>
            </MessageMeta>
            
            <MessageContent>{selectedMessage.content}</MessageContent>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Messages;