import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jobAPI, categoryAPI } from '../api';
import { getUser } from '../utils/auth';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
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
  
  span {
    color: #ff0000;
  }
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
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  resize: vertical;
  min-height: 300px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
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

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin-top: 20px;
`;

const JobCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    salary: '',
    deadline: '',
    workLocation: '',
    requiredExperienceYears: '',
    jobCategoryId: ''
  });

  useEffect(() => {
    // 기업 회원인지 확인
    const user = getUser();
    if (!user || !user.role?.includes('COMPANY')) {
      alert('기업 회원만 채용공고를 등록할 수 있습니다.');
      navigate('/');
      return;
    }

    // 카테고리 목록 가져오기
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
      setCategories([]);
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
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        salary: parseInt(formData.salary) || 0,
        requiredExperienceYears: parseInt(formData.requiredExperienceYears) || 0,
        jobCategoryId: parseInt(formData.jobCategoryId)
      };

      const response = await jobAPI.createJob(submitData);
      alert('채용공고가 등록되었습니다.');
      navigate('/jobs');
    } catch (err) {
      console.error('채용공고 등록 실패:', err);
      setError(err.response?.data?.message || '채용공고 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Container>
      <Title>채용공고 등록</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            공고 제목 <span>*</span>
          </Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 프론트엔드 개발자 모집"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            직무 카테고리 <span>*</span>
          </Label>
          <Select
            name="jobCategoryId"
            value={formData.jobCategoryId}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            근무지 <span>*</span>
          </Label>
          <Input
            type="text"
            name="workLocation"
            value={formData.workLocation}
            onChange={handleChange}
            placeholder="예: 서울시 강남구"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            급여 (만원) <span>*</span>
          </Label>
          <Input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="예: 4000"
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            경력 요구사항 (년) <span>*</span>
          </Label>
          <Input
            type="number"
            name="requiredExperienceYears"
            value={formData.requiredExperienceYears}
            onChange={handleChange}
            placeholder="예: 3"
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            마감일 <span>*</span>
          </Label>
          <Input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={getMinDate()}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            상세 내용 <span>*</span>
          </Label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="주요 업무, 자격 요건, 우대 사항, 복지 등을 자세히 작성해주세요."
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '등록 중...' : '등록하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default JobCreate;