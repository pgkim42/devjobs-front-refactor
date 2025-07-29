import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle } from 'lucide-react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${slideUp} 0.4s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #e8f5e9;
  border-radius: 50%;
  margin-bottom: 24px;
  
  svg {
    color: #4caf50;
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 32px;
`;

const Button = styled.button`
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #0052cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SignupSuccessModal = ({ isOpen, onClose, userType = 'individual' }) => {
  if (!isOpen) return null;

  const message = userType === 'company' 
    ? '기업 회원가입이 완료되었습니다.\n지금 바로 채용공고를 등록해보세요!'
    : '회원가입이 완료되었습니다.\n지금 바로 원하는 채용공고를 찾아보세요!';

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <CheckCircle />
        </IconWrapper>
        <Title>가입 완료!</Title>
        <Message>{message}</Message>
        <Button onClick={onClose}>로그인하러 가기</Button>
      </Modal>
    </Overlay>
  );
};

export default SignupSuccessModal;