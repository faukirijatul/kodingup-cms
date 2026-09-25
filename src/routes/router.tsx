import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CoursesPage } from '@/pages/Course/CoursesPage';
import { CourseDetailPage } from '@/pages/Course/CourseDetailPage';
import { SectionDetailPage } from '@/pages/SectionDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { OrganizationsPage } from '@/pages/OrganizationsPage';
import { MentorsPage } from '@/pages/Mentor/MentorsPage';
import { MentorFormPage } from '@/pages/Mentor/MentorFormPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/students" replace />} />

            <Route path="students" element={<StudentsPage />} />

            <Route path="courses">
              <Route index element={<CoursesPage />} />
              <Route path=":courseId" element={<CourseDetailPage />} />
              <Route
                path=":courseId/sections/:sectionPosition"
                element={<SectionDetailPage />}
              />
            </Route>

            <Route path="mentors">
              <Route index element={<MentorsPage />} />
              <Route path="form" element={<MentorFormPage />} />
            </Route>

            <Route path="organizations" element={<OrganizationsPage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
