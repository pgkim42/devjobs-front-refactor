import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { homeAPI } from '../api';
import { getUser } from '../utils/auth';
import Button from '../components/ui/Button';
import { IoArrowForward, IoStatsChart, IoPeople, IoBriefcase, IoLocation, IoCash, IoTime, IoRocket, IoRadio, IoBusinessSharp } from 'react-icons/io5';
import { cn } from '../utils/cn';


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
      '백엔드': <IoBusinessSharp />,
      '프론트엔드': <IoRadio />,
      '풀스택': <IoRocket />,
      '모바일': <IoStatsChart />,
      '데이터': <IoStatsChart />,
      'AI/ML': <IoRocket />,
      '보안': <IoBusinessSharp />,
      '게임': <IoRadio />
    };
    return icons[categoryName] || <IoBriefcase />;
  };

  // Framer Motion 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-4 py-24 md:py-16 pb-20 md:pb-12 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <IoRocket size={16} />
          지금 가장 핫한 개발자 채용 플랫폼
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            당신의 다음 커리어를<br />
            <span className="text-primary-600">DevJobs</span>에서 시작하세요
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            최고의 기업들이 당신을 기다리고 있습니다.<br />
            지금 바로 꿈의 직장을 찾아보세요.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-4 justify-center mb-16 md:flex-col md:items-center md:gap-3"
          variants={itemVariants}
        >
          <Button variant="primary" size="lg" onClick={() => navigate('/jobs')} className="flex items-center gap-2">
            <IoBriefcase size={20} />
            채용공고 둘러보기
          </Button>
          {!user && (
            <Button variant="secondary" size="lg" onClick={() => navigate('/signup')}>
              지금 시작하기
            </Button>
          )}
          {user && (
            <Button variant="secondary" size="lg" onClick={() => navigate('/mypage')}>
              마이페이지
            </Button>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-3 md:grid-cols-1 gap-16 md:gap-8 max-w-2xl mx-auto"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <div className="text-5xl md:text-4xl font-bold text-primary-600 mb-2 leading-none">
              {stats.totalJobs}+
            </div>
            <div className="text-base text-gray-600 font-medium">활성 채용공고</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-4xl font-bold text-primary-600 mb-2 leading-none">
              {stats.totalCompanies}+
            </div>
            <div className="text-base text-gray-600 font-medium">파트너 기업</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-4xl font-bold text-primary-600 mb-2 leading-none">
              {stats.totalUsers}+
            </div>
            <div className="text-base text-gray-600 font-medium">활성 사용자</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-4 py-20 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 md:mb-12">
            왜 DevJobs인가요?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-primary-100 text-primary-600 rounded-full">
                <IoRadio size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">맞춤형 매칭</h3>
              <p className="text-gray-600 leading-relaxed">
                AI 기반 추천 시스템으로 당신에게 딱 맞는 채용공고를 찾아드립니다
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-primary-100 text-primary-600 rounded-full">
                <IoRocket size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">빠른 지원</h3>
              <p className="text-gray-600 leading-relaxed">
                원클릭으로 간편하게 지원하고 실시간으로 진행 상황을 확인하세요
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-primary-100 text-primary-600 rounded-full">
                <IoBusinessSharp size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">검증된 기업</h3>
              <p className="text-gray-600 leading-relaxed">
                실리콘밸리부터 국내 대기업까지 검증된 기업들만 모았습니다
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Jobs Section */}
      <motion.section
        className="bg-white py-20 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-4">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 md:mb-12">
              최신 채용공고
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {recentJobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                custom={index}
              >
                <Link
                  to={`/jobs/${job.id}`}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-decoration-none"
                >
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {job.title}
                  </div>
                  <div className="text-primary-600 font-medium mb-3">
                    {job.companyName}
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <IoLocation size={16} />
                      <span>{job.workLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoCash size={16} />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoTime size={16} />
                      <span>{job.requiredExperienceYears}년차</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="text-center">
            <Link to="/jobs">
              <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
                전체 채용공고 보기
                <IoArrowForward />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-4 py-20 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 md:mb-12">
            직무별 채용공고
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              custom={index}
            >
              <Link
                to={`/jobs?category=${category.id}`}
                className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center text-decoration-none"
              >
                <div className="text-3xl mb-2 leading-none">
                  {getCategoryIcon(category.categoryName)}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {category.categoryName}
                </div>
                <div className="text-gray-600 text-sm">
                  {category.jobCount}개 채용중
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-primary-600 px-6 md:px-4 py-20 md:py-16 text-center text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            준비되셨나요?
          </h2>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {user ? '다양한 채용 기회를 확인해보세요' : '지금 바로 시작하고 꿈의 직장을 찾아보세요'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {user ? (
            <Link to="/jobs">
              <Button
                variant="secondary"
                size="xl"
                className="bg-white text-primary-600 border-white hover:bg-gray-50 hover:border-gray-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <IoBriefcase size={20} />
                채용공고 보러가기
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button
                variant="secondary"
                size="xl"
                className="bg-white text-primary-600 border-white hover:bg-gray-50 hover:border-gray-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <IoRocket size={20} />
                무료로 시작하기
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;