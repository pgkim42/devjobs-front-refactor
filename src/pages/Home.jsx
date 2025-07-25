import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { homeAPI } from '../api';
import { getUser } from '../utils/auth';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 80px;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 60px 20px 40px;
  }
`;

const Badge = styled.div`
  display: inline-block;
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: #2d3436;
  margin-bottom: 24px;
  line-height: 1.2;
  
  span {
    background: linear-gradient(45deg, #0066ff, #00d2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 22px;
  color: #636e72;
  margin-bottom: 40px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &.primary {
    background: linear-gradient(45deg, #0066ff, #00d2ff);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
    }
  }
  
  &.secondary {
    background: white;
    color: #0066ff;
    border: 2px solid transparent;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    &:hover {
      border-color: #0066ff;
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 28px;
    font-size: 16px;
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  h3 {
    font-size: 36px;
    font-weight: 700;
    color: #0066ff;
    margin-bottom: 8px;
  }
  
  p {
    color: #636e72;
    font-size: 16px;
  }
`;

const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: #2d3436;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 40px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    color: #2d3436;
    margin-bottom: 16px;
  }
  
  p {
    color: #636e72;
    line-height: 1.6;
  }
`;

const RecentJobs = styled.section`
  background: white;
  padding: 80px 0;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const JobsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const JobCard = styled(Link)`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s;
  display: block;
  
  &:hover {
    background: white;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  h4 {
    color: #2d3436;
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .company {
    color: #0066ff;
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .info {
    display: flex;
    gap: 16px;
    color: #636e72;
    font-size: 14px;
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  background: #0066ff;
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 500;
  margin: 0 auto;
  display: block;
  width: fit-content;
  transition: all 0.3s;
  
  &:hover {
    background: #0052cc;
    transform: translateY(-2px);
  }
`;

const Categories = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const CategoryCard = styled(Link)`
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    border-color: #0066ff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 102, 255, 0.2);
  }
  
  .icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  h4 {
    color: #2d3436;
    font-size: 16px;
    margin-bottom: 4px;
  }
  
  p {
    color: #636e72;
    font-size: 14px;
  }
`;

const CTASection = styled.section`
  background: linear-gradient(45deg, #0066ff, #00d2ff);
  padding: 80px 20px;
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const CTAText = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #0066ff;
  padding: 16px 40px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const user = getUser(); // 현재 로그인한 사용자 정보
  const [recentJobs, setRecentJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 홈 대시보드 데이터 가져오기
      const homeData = await homeAPI.getDashboard();
      
      // 통계 데이터 설정
      setStats({
        totalJobs: homeData.statistics.totalJobs,
        totalCompanies: homeData.statistics.totalCompanies,
        totalUsers: homeData.statistics.totalUsers
      });
      
      // 최신 채용공고 설정
      setRecentJobs(homeData.recentJobs || []);
      
      // 인기 카테고리 설정
      setCategories(homeData.popularCategories || []);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      // 에러 시 빈 데이터로 설정
      setStats({ totalJobs: 0, totalCompanies: 0, totalUsers: 0 });
      setRecentJobs([]);
      setCategories([]);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return '협의';
    return `${(salary / 10000).toFixed(0)}억원`;
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      '백엔드': '⚙️',
      '프론트엔드': '🎨',
      '풀스택': '🔄',
      '모바일': '📱',
      '데이터': '📊',
      'AI/ML': '🤖',
      '보안': '🔒',
      '게임': '🎮'
    };
    return icons[categoryName] || '💻';
  };

  return (
    <Container>
      <Hero>
        <Badge>🔥 지금 가장 핫한 개발자 채용 플랫폼</Badge>
        <Title>
          당신의 다음 커리어를<br />
          <span>DevJobs</span>에서 시작하세요
        </Title>
        <Subtitle>
          최고의 기업들이 당신을 기다리고 있습니다<br />
          지금 바로 꿈의 직장을 찾아보세요
        </Subtitle>
        <ButtonGroup>
          <Button className="primary" onClick={() => navigate('/jobs')}>
            채용공고 둘러보기
          </Button>
          {!user && (
            <Button className="secondary" onClick={() => navigate('/signup')}>
              지금 시작하기
            </Button>
          )}
          {user && (
            <Button className="secondary" onClick={() => navigate('/mypage')}>
              마이페이지
            </Button>
          )}
        </ButtonGroup>
        <Stats>
          <StatItem>
            <h3>{stats.totalJobs}+</h3>
            <p>활성 채용공고</p>
          </StatItem>
          <StatItem>
            <h3>{stats.totalCompanies}+</h3>
            <p>파트너 기업</p>
          </StatItem>
          <StatItem>
            <h3>{stats.totalUsers}+</h3>
            <p>활성 사용자</p>
          </StatItem>
        </Stats>
      </Hero>

      <Features>
        <SectionTitle>왜 DevJobs인가요?</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <div className="icon">🎯</div>
            <h3>맞춤형 매칭</h3>
            <p>AI 기반 추천 시스템으로 당신에게 딱 맞는 채용공고를 찾아드립니다</p>
          </FeatureCard>
          <FeatureCard>
            <div className="icon">🚀</div>
            <h3>빠른 지원</h3>
            <p>원클릭으로 간편하게 지원하고 실시간으로 진행 상황을 확인하세요</p>
          </FeatureCard>
          <FeatureCard>
            <div className="icon">🏢</div>
            <h3>검증된 기업</h3>
            <p>실리콘밸리부터 국내 대기업까지 검증된 기업들만 모았습니다</p>
          </FeatureCard>
        </FeatureGrid>
      </Features>

      <RecentJobs>
        <JobsContainer>
          <SectionTitle>최신 채용공고</SectionTitle>
          <JobGrid>
            {recentJobs.map(job => (
              <JobCard key={job.id} to={`/jobs/${job.id}`}>
                <h4>{job.title}</h4>
                <p className="company">{job.companyName}</p>
                <div className="info">
                  <span>📍 {job.workLocation}</span>
                  <span>💰 {formatSalary(job.salary)}</span>
                  <span>🕒 {job.requiredExperienceYears}년차</span>
                </div>
              </JobCard>
            ))}
          </JobGrid>
          <ViewAllButton to="/jobs">전체 채용공고 보기 →</ViewAllButton>
        </JobsContainer>
      </RecentJobs>

      <Categories>
        <SectionTitle>직무별 채용공고</SectionTitle>
        <CategoryGrid>
          {categories.map(category => (
            <CategoryCard key={category.id} to={`/jobs?category=${category.id}`}>
              <div className="icon">{getCategoryIcon(category.categoryName)}</div>
              <h4>{category.categoryName}</h4>
              <p>{category.jobCount}개 채용중</p>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Categories>

      <CTASection>
        <CTATitle>준비되셨나요?</CTATitle>
        <CTAText>
          {user ? '다양한 채용 기회를 확인해보세요' : '지금 바로 시작하고 꿈의 직장을 찾아보세요'}
        </CTAText>
        {user ? (
          <CTAButton to="/jobs">채용공고 보러가기</CTAButton>
        ) : (
          <CTAButton to="/signup">무료로 시작하기</CTAButton>
        )}
      </CTASection>
    </Container>
  );
};

export default Home;