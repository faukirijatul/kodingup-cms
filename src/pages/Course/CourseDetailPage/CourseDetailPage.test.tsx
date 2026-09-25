import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { CourseDetailPage } from './CourseDetailPage';

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({
    breadcrumbs,
  }: {
    breadcrumbs: Array<{ label: string; href?: string }>;
  }) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((b, index) => (
        <span key={index} data-testid="breadcrumb-item">
          {b.label}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('./components/CourseHero', () => ({
  CourseHero: ({ courseId }: { courseId: string }) => (
    <div data-testid="course-hero">Course Hero - Course: {courseId}</div>
  ),
}));

vi.mock('./components/CourseSectionsTable', () => ({
  CourseSectionsTable: ({ courseId }: { courseId: string }) => (
    <div data-testid="course-sections-table">
      Sections Table - Course: {courseId}
    </div>
  ),
}));

vi.mock('./components/CourseStatus', () => ({
  CourseStatus: ({ courseId }: { courseId: string }) => (
    <div data-testid="course-status">Course Status - Course: {courseId}</div>
  ),
}));

describe('CourseDetailPage', () => {
  let queryClient: QueryClient;

  const renderComponentWithParams = (courseId = 'course-123') => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/courses/${courseId}`]}>
          <Routes>
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders all main course detail components correctly with route params', () => {
    renderComponentWithParams('course-abc');

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('course-hero')).toBeInTheDocument();
    expect(screen.getByTestId('course-sections-table')).toBeInTheDocument();
    expect(screen.getByTestId('course-status')).toBeInTheDocument();

    expect(
      screen.getByText('Course Hero - Course: course-abc'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sections Table - Course: course-abc'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Course Status - Course: course-abc'),
    ).toBeInTheDocument();
  });

  it('passes correct breadcrumbs structure based on URL parameter', () => {
    renderComponentWithParams('course-999');

    const breadcrumbs = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbs).toHaveLength(2);

    expect(breadcrumbs[0]).toHaveTextContent('Courses');
    expect(breadcrumbs[1]).toHaveTextContent('course-999');
  });

  it('handles empty route parameters gracefully with fallbacks', () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/courses/detail']}>
          <Routes>
            <Route path="/courses/detail" element={<CourseDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Course Hero - Course:')).toBeInTheDocument();
    expect(screen.getByText('Sections Table - Course:')).toBeInTheDocument();
    expect(screen.getByText('Course Status - Course:')).toBeInTheDocument();
  });
});
