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

const SkillsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const SkillTag = styled.span`
  background: #e3f2fd;
  color: #0066ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: #ff0000;
  }
`;

const SkillInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #0052cc;
  }
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

const ProfileIndividual = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    portfolioUrl: '',
    skills: []
  });

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'ROLE_INDIVIDUAL') {
      alert('권한이 없습니다.');
      navigate('/');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const profile = await profileAPI.getIndividualProfile();
      setFormData({
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        portfolioUrl: profile.portfolioUrl || '',
        skills: profile.skills || []
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await profileAPI.updateIndividualProfile(formData);
      alert('프로필이 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>프로필을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton to="/mypage">← 마이페이지로 돌아가기</BackButton>
      <Title>프로필 관리</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>전화번호</Label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="010-0000-0000"
          />
        </FormGroup>

        <FormGroup>
          <Label>주소</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="서울시 강남구"
          />
        </FormGroup>

        <FormGroup>
          <Label>포트폴리오 URL</Label>
          <Input
            type="url"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </FormGroup>

        <FormGroup>
          <Label>스킬</Label>
          <SkillInput>
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="스킬을 입력하세요"
            />
            <AddButton type="button" onClick={handleAddSkill}>추가</AddButton>
          </SkillInput>
          <SkillsContainer>
            {formData.skills.map((skill, index) => (
              <SkillTag key={index}>
                {skill}
                <RemoveButton type="button" onClick={() => handleRemoveSkill(skill)}>
                  ×
                </RemoveButton>
              </SkillTag>
            ))}
          </SkillsContainer>
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

export default ProfileIndividual;