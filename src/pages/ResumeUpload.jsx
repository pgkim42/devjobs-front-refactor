import React, { useState } from 'react';
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
  
  span {
    color: #ff0000;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #0066ff;
    background: #f8f9fa;
  }
  
  &.has-file {
    border-color: #22c55e;
    background: #f0fdf4;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #999;
  margin-bottom: 10px;
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  
  &.file-name {
    color: #22c55e;
    font-weight: 500;
  }
`;

const FileInfo = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
  
  ul {
    margin: 0;
    padding-left: 20px;
    color: #666;
    font-size: 14px;
    
    li {
      margin-bottom: 5px;
    }
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

const SuccessMessage = styled.div`
  color: #22c55e;
  text-align: center;
  margin-top: 20px;
`;

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 파일 크기 체크 (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      
      // 파일 형식 체크
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('PDF, DOC, DOCX 파일만 업로드 가능합니다.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      await profileAPI.registerResume(formData);
      setSuccess('이력서가 성공적으로 등록되었습니다!');
      
      // 2초 후 마이페이지로 이동
      setTimeout(() => {
        navigate('/mypage');
      }, 2000);
    } catch (err) {
      console.error('이력서 업로드 실패:', err);
      setError(err.response?.data?.message || '이력서 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileAreaClick = () => {
    document.getElementById('resumeFile').click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Container>
      <BackButton to="/mypage">← 마이페이지로 돌아가기</BackButton>
      <Title>이력서 등록</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            이력서 파일 <span>*</span>
          </Label>
          <FileUploadArea 
            onClick={handleFileAreaClick}
            className={file ? 'has-file' : ''}
          >
            <FileInput
              id="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <UploadIcon>📄</UploadIcon>
            {file ? (
              <>
                <UploadText className="file-name">{file.name}</UploadText>
                <UploadText>({formatFileSize(file.size)})</UploadText>
              </>
            ) : (
              <>
                <UploadText>클릭하여 파일을 선택하세요</UploadText>
                <UploadText>또는 파일을 여기에 드래그하세요</UploadText>
              </>
            )}
          </FileUploadArea>
          
          <FileInfo>
            <ul>
              <li>허용 파일 형식: PDF, DOC, DOCX</li>
              <li>최대 파일 크기: 10MB</li>
              <li>이전에 등록한 이력서가 있다면 새로운 이력서로 대체됩니다</li>
            </ul>
          </FileInfo>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonContainer>
          <CancelButton 
            type="button" 
            onClick={() => navigate('/mypage')}
            disabled={uploading}
          >
            취소
          </CancelButton>
          <SubmitButton 
            type="submit" 
            disabled={uploading || !file}
          >
            {uploading ? '업로드 중...' : '등록하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default ResumeUpload;