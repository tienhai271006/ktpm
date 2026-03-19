import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EmployeeListPage } from '@/pages/employees/EmployeeListPage';
import { DepartmentPage } from '@/pages/employees/DepartmentPage';
import { AttendancePage } from '@/pages/employees/AttendancePage';
import { PipelinePage } from '@/pages/recruitment/PipelinePage';
import { JobListPage } from '@/pages/recruitment/JobListPage';
import { CandidateListPage } from '@/pages/recruitment/CandidateListPage';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace/>;
  return <>{children}</>;
};

const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/" replace/>;
  return <>{children}</>;
};

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<GuestOnly><LoginPage/></GuestOnly>}/>
      <Route path="/" element={<RequireAuth><MainLayout/></RequireAuth>}>
        <Route index element={<DashboardPage/>}/>
        <Route path="employees" element={<EmployeeListPage/>}/>
        <Route path="departments" element={<DepartmentPage/>}/>
        <Route path="attendance" element={<AttendancePage/>}/>
        <Route path="recruitment/pipeline" element={<PipelinePage/>}/>
        <Route path="recruitment/jobs" element={<JobListPage/>}/>
        <Route path="recruitment/candidates" element={<CandidateListPage/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </BrowserRouter>
);
