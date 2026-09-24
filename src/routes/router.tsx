import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './components/GuestRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route index element={<Navigate to="/students" replace />} />

        <Route path="/students" element={<StudentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
