import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudentsTableFilters } from '.';
import { useOrganizationOptions } from '@/hooks/dataOptions/useOrganizationOptions';

vi.mock('@/hooks/dataOptions/useOrganizationOptions');

vi.mock('@/components/DataSelect', () => ({
  DataSelect: ({
    value,
    onValueChange,
    placeholder,
  }: {
    value: string;
    onValueChange: (val: string) => void;
    placeholder: string;
  }) => (
    <button
      type="button"
      data-testid="data-select"
      data-value={value}
      onClick={() => onValueChange('org-1')}
    >
      {placeholder}
    </button>
  ),
}));

type UseOrganizationOptionsReturn = ReturnType<typeof useOrganizationOptions>;

describe('StudentsTableFilters', () => {
  const mockHandleSearchValueChange = vi.fn();
  const mockHandleOrgChange = vi.fn();
  const mockSetPage = vi.fn();
  const mockHandleSearchOrgChange = vi.fn();

  beforeEach(() => {
    vi.mocked(useOrganizationOptions).mockReturnValue({
      organizationOptions: [
        { value: '', label: 'All Organizations' },
        { value: 'org-1', label: 'Org Alpha' },
      ],
      page: 1,
      searchQuery: '',
      setPage: mockSetPage,
      handleSearchOrgChange: mockHandleSearchOrgChange,
      isOrgsLoading: false,
      totalOrgs: 2,
    } as UseOrganizationOptionsReturn);
  });

  it('renders search input and DataSelect with initial props', () => {
    render(
      <StudentsTableFilters
        searchQuery="John"
        handleSearchValueChange={mockHandleSearchValueChange}
        selectedOrgId="org-1"
        handleOrgChange={mockHandleOrgChange}
      />,
    );

    const input = screen.getByPlaceholderText('Search by name or email');
    expect(input).toHaveValue('John');
    expect(screen.getByTestId('data-select')).toBeInTheDocument();
  });

  it('calls handleSearchValueChange when typing in search input', async () => {
    const user = userEvent.setup();
    render(
      <StudentsTableFilters
        searchQuery=""
        handleSearchValueChange={mockHandleSearchValueChange}
        selectedOrgId=""
        handleOrgChange={mockHandleOrgChange}
      />,
    );

    const input = screen.getByPlaceholderText('Search by name or email');
    await user.type(input, 'a');

    expect(mockHandleSearchValueChange).toHaveBeenCalledTimes(1);
  });

  it('calls handleOrgChange when an option is selected from DataSelect', async () => {
    const user = userEvent.setup();
    render(
      <StudentsTableFilters
        searchQuery=""
        handleSearchValueChange={mockHandleSearchValueChange}
        selectedOrgId=""
        handleOrgChange={mockHandleOrgChange}
      />,
    );

    await user.click(screen.getByTestId('data-select'));

    expect(mockHandleOrgChange).toHaveBeenCalledWith('org-1');
  });
});
