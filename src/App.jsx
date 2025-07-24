import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

// 레이아웃
import Layout from './components/Layout';

// 페이지
import Home from './pages/Home';
import Login from './pages/Login';
import SignupSelect from './pages/SignupSelect';
import SignupIndividual from './pages/SignupIndividual';
import SignupCompany from './pages/SignupCompany';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobCreate from './pages/JobCreate';
import JobEdit from './pages/JobEdit';
import JobApplications from './pages/JobApplications';
import MyPage from './pages/MyPage';
import ProfileIndividual from './pages/ProfileIndividual';
import ProfileCompany from './pages/ProfileCompany';
import ResumeUpload from './pages/ResumeUpload';

// 전역 스타일
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f7fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignupSelect />} />
          <Route path="signup/individual" element={<SignupIndividual />} />
          <Route path="signup/company" element={<SignupCompany />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/create" element={<JobCreate />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="jobs/:id/edit" element={<JobEdit />} />
          <Route path="jobs/:id/applications" element={<JobApplications />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="profile/individual" element={<ProfileIndividual />} />
          <Route path="profile/company" element={<ProfileCompany />} />
          <Route path="resume/upload" element={<ResumeUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;