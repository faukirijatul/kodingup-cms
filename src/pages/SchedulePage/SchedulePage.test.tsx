import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SchedulePage } from './SchedulePage';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';

vi.mock('@/hooks/dataOptions/useOrganizationOptions');

interface DashboardHeaderProps {
  breadcrumbs: Array<{ label: string }>;
}

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: ({ breadcrumbs }: DashboardHeaderProps) => (
    <div data-testid="dashboard-header">
      {breadcrumbs.map((b) => b.label).join(' > ')}
    </div>
  ),
}));

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({ title, description, children }: PageHeaderProps) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

interface DataSelectOption {
  label: string;
  value: string;
}

interface DataSelectProps {
  options: DataSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
}

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({
    options,
    value,
    onValueChange,
    isLoading,
  }: DataSelectProps) => (
    <div data-testid="data-select">
      <span>Select Value: {value || 'None'}</span>
      <span>Loading: {isLoading ? 'Yes' : 'No'}</span>
      <select
        aria-label="Select organization"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

interface ScheduleCalendarContainerProps {
  selectedOrgId: string;
}

vi.mock('./components/ScheduleCalendarContainer', () => ({
  ScheduleCalendarContainer: ({
    selectedOrgId,
  }: ScheduleCalendarContainerProps) => (
    <div data-testid="schedule-calendar-container">
      Calendar Selected Org: {selectedOrgId || 'None'}
    </div>
  ),
}));

const mockUseOrganizationOptions = vi.mocked(useOrganizationOptions);

const renderWithRouter = (initialEntries = ['/schedule']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockOrganizations = [
  { label: 'KodingUp Academy', value: 'org-1' },
  { label: 'Tech Academy', value: 'org-2' },
];

describe('SchedulePage Component', () => {
  it('renders dashboard header, page title, and calendar container correctly', () => {
    mockUseOrganizationOptions.mockReturnValue({
      organizationOptions: mockOrganizations,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    renderWithRouter(['/schedule?org=org-1']);

    expect(screen.getByTestId('dashboard-header')).toHaveTextContent(
      'Schedule',
    );
    expect(
      screen.getByRole('heading', { name: 'Schedule' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Manage sessions, assignments, and events'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('data-select')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-calendar-container')).toHaveTextContent(
      'Calendar Selected Org: org-1',
    );
  });

  it('automatically sets default org in search params if no org param is selected initially', async () => {
    mockUseOrganizationOptions.mockReturnValue({
      organizationOptions: mockOrganizations,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    renderWithRouter(['/schedule']);

    await waitFor(() => {
      expect(
        screen.getByTestId('schedule-calendar-container'),
      ).toHaveTextContent('Calendar Selected Org: org-1');
    });
  });

  it('updates search params and calendar container when organization selection changes', async () => {
    const user = userEvent.setup();

    mockUseOrganizationOptions.mockReturnValue({
      organizationOptions: mockOrganizations,
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: false,
      totalOrgs: 2,
    });

    renderWithRouter(['/schedule?org=org-1']);

    expect(screen.getByTestId('schedule-calendar-container')).toHaveTextContent(
      'Calendar Selected Org: org-1',
    );

    const select = screen.getByRole('combobox', {
      name: 'Select organization',
    });
    await user.selectOptions(select, 'org-2');

    expect(screen.getByTestId('schedule-calendar-container')).toHaveTextContent(
      'Calendar Selected Org: org-2',
    );
  });

  it('does not auto-select organization when organizations are loading', () => {
    mockUseOrganizationOptions.mockReturnValue({
      organizationOptions: [],
      page: 1,
      searchQuery: '',
      setPage: vi.fn(),
      handleSearchOrgChange: vi.fn(),
      isOrgsLoading: true,
      totalOrgs: 0,
    });

    renderWithRouter(['/schedule']);

    expect(screen.getByTestId('schedule-calendar-container')).toHaveTextContent(
      'Calendar Selected Org: None',
    );
  });
});
