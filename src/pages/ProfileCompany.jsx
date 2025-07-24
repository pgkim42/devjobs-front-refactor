import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { profileAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 800px;
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

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ReadOnlyInfo = styled.div`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SubmitButton = styled(Button)`
  background: #0066ff;
  color: white;
  
  &:hover:not(:disabled) {
    background: #0052cc;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #333;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const ProfileCompany = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyWebsite: '',
    industry: '',
    logoUrl: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_COMPANY') {
      alert('권한이 없습니다.');
      navigate('/');
      return;
    }

    fetchProfile();
  }, [navigate, user]);

  const fetchProfile = async () => {
    try {
      const profile = await profileAPI.getCompanyProfile();
      setFormData({
        companyWebsite: profile.companyWebsite || '',
        industry: profile.industry || '',
        logoUrl: profile.logoUrl || ''
      });
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await profileAPI.updateCompanyProfile(formData);
      alert('기업정보가 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('기업정보 수정 실패:', error);
      alert('기업정보 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>기업정보를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton to="/mypage">← 마이페이지로 돌아가기</BackButton>
      <Title>기업정보 관리</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>기업명</Label>
          <ReadOnlyInfo>{user?.companyName}</ReadOnlyInfo>
        </FormGroup>

        <FormGroup>
          <Label>사업자등록번호</Label>
          <ReadOnlyInfo>{user?.companyCode}</ReadOnlyInfo>
        </FormGroup>

        <FormGroup>
          <Label>대표자명</Label>
          <ReadOnlyInfo>{user?.ceoName}</ReadOnlyInfo>
        </FormGroup>

        <FormGroup>
          <Label>회사 웹사이트</Label>
          <Input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://www.company.com"
          />
        </FormGroup>

        <FormGroup>
          <Label>업종</Label>
          <Input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="IT/소프트웨어"
          />
        </FormGroup>

        <FormGroup>
          <Label>로고 URL</Label>
          <Input
            type="url"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://www.company.com/logo.png"
          />
        </FormGroup>

        <ButtonContainer>
          <CancelButton type="button" onClick={() => navigate('/mypage')}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? '저장 중...' : '저장하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default ProfileCompany;