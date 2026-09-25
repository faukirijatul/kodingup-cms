import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataSelect, type SelectOption } from '.';

const mockOptions: SelectOption[] = [
  { value: 'org-1', label: 'Organization One' },
  { value: 'org-2', label: 'Organization Two' },
  { value: 'org-3', label: 'Alpha Corp' },
];

describe('DataSelect', () => {
  it('renders trigger with placeholder', () => {
    render(
      <DataSelect options={mockOptions} placeholder="Select Organization" />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select Organization')).toBeInTheDocument();
  });

  it('renders options when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<DataSelect options={mockOptions} />);

    await user.click(screen.getByRole('combobox'));

    expect(
      await screen.findByRole('option', { name: 'Organization One' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Organization Two' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Alpha Corp' }),
    ).toBeInTheDocument();
  });

  it('triggers onValueChange when an option is selected', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <DataSelect options={mockOptions} onValueChange={handleValueChange} />,
    );

    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', {
      name: 'Organization One',
    });
    await user.click(option);

    expect(handleValueChange).toHaveBeenCalledWith('org-1');
  });

  describe('Search Functionality', () => {
    it('filters options client-side when searchable is enabled', async () => {
      const user = userEvent.setup();
      render(
        <DataSelect
          options={mockOptions}
          searchable
          searchPlaceholder="Type to search"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const searchInput = await screen.findByPlaceholderText('Type to search');
      await user.type(searchInput, 'Alpha');

      expect(
        screen.getByRole('option', { name: 'Alpha Corp' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Organization One' }),
      ).not.toBeInTheDocument();
    });

    it('calls onSearchChange when search input changes (server-side search mode)', async () => {
      const user = userEvent.setup();
      const handleSearchChange = vi.fn();

      render(
        <DataSelect
          options={mockOptions}
          searchable
          onSearchChange={handleSearchChange}
          searchQuery=""
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const searchInput = await screen.findByPlaceholderText('Search...');
      await user.type(searchInput, 'Org');

      expect(handleSearchChange).toHaveBeenCalled();
    });
  });

  describe('States & Pagination', () => {
    it('displays loading spinner when isLoading is true', async () => {
      const user = userEvent.setup();
      render(<DataSelect options={[]} isLoading />);

      await user.click(screen.getByRole('combobox'));

      expect(await screen.findByText('Loading...')).toBeInTheDocument();
    });

    it('displays custom empty message when no options match', async () => {
      const user = userEvent.setup();
      render(<DataSelect options={[]} emptyMessage="No organizations found" />);

      await user.click(screen.getByRole('combobox'));

      expect(
        await screen.findByText('No organizations found'),
      ).toBeInTheDocument();
    });

    it('handles pagination controls correctly', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <DataSelect
          options={mockOptions}
          pagination={{
            page: 1,
            pageSize: 10,
            total: 25,
            onPageChange: handlePageChange,
          }}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      expect(await screen.findByText('1 / 3')).toBeInTheDocument();

      const nextButton = screen.getAllByRole('button')[1];
      await user.click(nextButton);

      expect(handlePageChange).toHaveBeenCalledWith(2);
    });
  });
});
