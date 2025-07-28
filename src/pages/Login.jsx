import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { authAPI } from "../api/auth";

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 40px 20px;
    padding: 30px 20px;
    max-width: none;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }
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

  @media (max-width: 768px) {
    padding: 14px 12px;
    font-size: 16px;
    /* iOS 줌 방지 */
    -webkit-text-size-adjust: 100%;
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
  cursor: pointer;

  &:hover {
    background: #0052cc;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  font-size: 14px;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;

  a {
    color: #0066ff;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authAPI.signIn(formData);
      console.log("로그인 성공:", result);

      // 역할에 따른 리다이렉트
      if (result.user?.role?.includes("COMPANY")) {
        window.location.href = "/mypage";
      } else {
        window.location.href = "/jobs";
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="loginId"
          placeholder="아이디"
          value={formData.loginId}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LinkContainer>
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </LinkContainer>
    </Container>
  );
};

export default Login;
