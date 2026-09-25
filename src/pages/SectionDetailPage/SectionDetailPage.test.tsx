import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { SectionDetailPage } from './SectionDetailPage';

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

vi.mock('./components/SectionDetailHero', () => ({
  SectionDetailHero: ({
    courseId,
    sectionPosition,
  }: {
    courseId: string;
    sectionPosition: string;
  }) => (
    <div data-testid="section-detail-hero">
      Hero - Course: {courseId}, Section: {sectionPosition}
    </div>
  ),
}));

vi.mock('./components/CourseSectionModulesTable', () => ({
  CourseSectionModulesTable: ({
    courseId,
    sectionPosition,
  }: {
    courseId: string;
    sectionPosition: string;
  }) => (
    <div data-testid="course-section-modules-table">
      Modules Table - Course: {courseId}, Section: {sectionPosition}
    </div>
  ),
}));

describe('SectionDetailPage', () => {
  let queryClient: QueryClient;

  const renderComponentWithParams = (
    courseId = 'course-123',
    sectionPosition = '1',
  ) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[`/courses/${courseId}/sections/${sectionPosition}`]}
        >
          <Routes>
            <Route
              path="/courses/:courseId/sections/:sectionPosition"
              element={<SectionDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders all main section components correctly with route params', () => {
    renderComponentWithParams('course-abc', '2');

    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('section-detail-hero')).toBeInTheDocument();
    expect(
      screen.getByTestId('course-section-modules-table'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Hero - Course: course-abc, Section: 2'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Modules Table - Course: course-abc, Section: 2'),
    ).toBeInTheDocument();
  });

  it('passes correct breadcrumbs structure based on URL parameters', () => {
    renderComponentWithParams('course-999', '3');

    const breadcrumbs = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbs).toHaveLength(4);

    expect(breadcrumbs[0]).toHaveTextContent('Courses');
    expect(breadcrumbs[1]).toHaveTextContent('course-999');
    expect(breadcrumbs[2]).toHaveTextContent('Sections');
    expect(breadcrumbs[3]).toHaveTextContent('3');
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
            <Route path="/courses/detail" element={<SectionDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Hero - Course: , Section:')).toBeInTheDocument();
    expect(
      screen.getByText('Modules Table - Course: , Section:'),
    ).toBeInTheDocument();
  });
});
