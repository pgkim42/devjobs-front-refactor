import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authAPI } from '../api/auth';
import SignupSuccessModal from '../components/SignupSuccessModal';

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  
  &:hover {
    background: #0052cc;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin-top: 10px;
`;

const SignupIndividual = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { passwordConfirm, ...signupData } = formData;
      await authAPI.signUpIndividual(signupData);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <>
      <Container>
      <Title>개인 회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            name="loginId"
            value={formData.loginId}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>전화번호</Label>
          <Input
            type="tel"
            name="phone"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>생년월일</Label>
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
    <SignupSuccessModal 
      isOpen={showSuccessModal} 
      onClose={handleModalClose}
      userType="individual"
    />
    </>
  );
};

export default SignupIndividual;