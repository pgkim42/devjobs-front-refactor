import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 40px;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
`;

const Card = styled.div`
  width: 250px;
  padding: 40px 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 14px;
`;

const SignupSelect = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>회원가입 유형 선택</Title>
      <CardContainer>
        <Card onClick={() => navigate('/signup/individual')}>
          <Icon>👤</Icon>
          <CardTitle>개인 회원</CardTitle>
          <CardDescription>구직 활동을 위한 개인 회원가입</CardDescription>
        </Card>
        <Card onClick={() => navigate('/signup/company')}>
          <Icon>🏢</Icon>
          <CardTitle>기업 회원</CardTitle>
          <CardDescription>인재 채용을 위한 기업 회원가입</CardDescription>
        </Card>
      </CardContainer>
    </Container>
  );
};

export default SignupSelect;