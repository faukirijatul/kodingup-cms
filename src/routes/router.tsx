import { StudentsPage } from '@/pages/StudentsPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/students" replace />} />

        <Route path="/students" element={<StudentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
