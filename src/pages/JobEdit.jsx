import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin-top: 20px;
`;

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    const user = getUser();
    if (!user || !user.role?.includes('COMPANY')) {
      alert('권한이 없습니다.');
      navigate('/');
      return;
    }

    fetchData();
  }, [id, navigate]);

  const fetchData = async () => {
    try {
      // 카테고리 목록과 채용공고 정보 동시에 가져오기
      const [categoriesData, jobData] = await Promise.all([
        categoryAPI.getCategories(),
        jobAPI.getJobDetail(id)
      ]);

      setCategories(categoriesData);
      
      // 채용공고 정보로 폼 초기화
      setFormData({
        title: jobData.title || '',
        content: jobData.content || '',
        salary: jobData.salary || '',
        deadline: jobData.deadline || '',
        workLocation: jobData.workLocation || '',
        requiredExperienceYears: jobData.requiredExperienceYears || '',
        jobCategoryId: jobData.jobCategoryId || ''
      });
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setError('채용공고를 불러올 수 없습니다.');
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
    setError('');

    try {
      const submitData = {
        ...formData,
        salary: parseInt(formData.salary) || 0,
        requiredExperienceYears: parseInt(formData.requiredExperienceYears) || 0,
        jobCategoryId: parseInt(formData.jobCategoryId)
      };

      await jobAPI.updateJob(id, submitData);
      alert('채용공고가 수정되었습니다.');
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error('채용공고 수정 실패:', err);
      setError(err.response?.data?.message || '채용공고 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>채용공고를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>채용공고 수정</Title>
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
            required
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
          <CancelButton type="button" onClick={() => navigate(`/jobs/${id}`)}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? '수정 중...' : '수정하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default JobEdit;