import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUsers, FaBuilding, FaBriefcase, FaTags } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const Card = styled(Link)`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: #1976d2;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const AdminDashboard = () => {
  const menuItems = [
    {
      to: '/admin/users/individual',
      icon: <FaUsers />,
      title: '개인회원 관리',
      description: '개인회원 목록 조회 및 관리'
    },
    {
      to: '/admin/users/company',
      icon: <FaBuilding />,
      title: '기업회원 관리',
      description: '기업회원 목록 조회 및 관리'
    },
    {
      to: '/admin/job-postings',
      icon: <FaBriefcase />,
      title: '채용공고 관리',
      description: '채용공고 목록 조회 및 관리'
    },
    {
      to: '/admin/categories',
      icon: <FaTags />,
      title: '카테고리 관리',
      description: '직무 카테고리 추가/수정/삭제'
    }
  ];

  return (
    <Container>
      <Title>관리자 대시보드</Title>
      <GridContainer>
        {menuItems.map((item) => (
          <Card key={item.to} to={item.to}>
            <IconWrapper>{item.icon}</IconWrapper>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        ))}
      </GridContainer>
    </Container>
  );
};

export default AdminDashboard;