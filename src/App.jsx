import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 레이아웃
import Layout from "./components/Layout";

// 페이지
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignupSelect from "./pages/SignupSelect";
import SignupIndividual from "./pages/SignupIndividual";
import SignupCompany from "./pages/SignupCompany";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import JobCreate from "./pages/JobCreate";
import JobEdit from "./pages/JobEdit";
import JobApplications from "./pages/JobApplications";
import MyPage from "./pages/MyPage";
import ProfileIndividual from "./pages/ProfileIndividual";
import ProfileCompany from "./pages/ProfileCompany";
import ResumeUpload from "./pages/ResumeUpload";
import BookmarkedJobs from "./pages/BookmarkedJobs";
import Messages from "./pages/Messages";
import FAQ from "./pages/Faq";

// 관리자 페이지
import AdminDashboard from "./components/admin/AdminDashboard";
import IndividualUserList from "./components/admin/IndividualUserList";
import IndividualUserDetail from "./components/admin/IndividualUserDetail";
import CompanyUserList from "./components/admin/CompanyUserList";
import CompanyUserDetail from "./components/admin/CompanyUserDetail";
import JobPostingManagement from "./components/admin/JobPostingManagement";
import CategoryManagement from "./components/admin/CategoryManagement";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";


function App() {
  return (
    <BrowserRouter>
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
          <Route path="bookmarks" element={<BookmarkedJobs />} />
          <Route path="messages" element={<Messages />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="admin/users/individual" element={<ProtectedAdminRoute><IndividualUserList /></ProtectedAdminRoute>} />
          <Route path="admin/users/individual/:userId" element={<ProtectedAdminRoute><IndividualUserDetail /></ProtectedAdminRoute>} />
          <Route path="admin/users/company" element={<ProtectedAdminRoute><CompanyUserList /></ProtectedAdminRoute>} />
          <Route path="admin/users/company/:userId" element={<ProtectedAdminRoute><CompanyUserDetail /></ProtectedAdminRoute>} />
          <Route path="admin/job-postings" element={<ProtectedAdminRoute><JobPostingManagement /></ProtectedAdminRoute>} />
          <Route path="admin/categories" element={<ProtectedAdminRoute><CategoryManagement /></ProtectedAdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
