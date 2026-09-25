import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MultiDataSelect, type SelectOption } from './MultiDataSelect';

describe('MultiDataSelect', () => {
  const options: SelectOption[] = [
    { value: 'react', label: 'React.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular', disabled: true },
  ];

  describe('Rendering & Selection', () => {
    it('renders placeholder when no options are selected', () => {
      render(
        <MultiDataSelect options={options} placeholder="Select tech..." />,
      );

      expect(screen.getByText('Select tech...')).toBeInTheDocument();
    });

    it('renders selected option badges when value is provided', () => {
      render(<MultiDataSelect options={options} value={['react', 'vue']} />);

      expect(screen.getAllByText('React.js')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Vue.js')[0]).toBeInTheDocument();
    });

    it('opens popover and selects an option when clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <MultiDataSelect
          options={options}
          value={[]}
          onValueChange={onValueChange}
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const dialog = screen.getByRole('dialog');
      const optionItem = within(dialog).getByText('React.js');
      await user.click(optionItem);

      expect(onValueChange).toHaveBeenCalledWith(['react']);
    });

    it('deselects an already selected option when clicked in dropdown', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <MultiDataSelect
          options={options}
          value={['react', 'vue']}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const dialog = screen.getByRole('dialog');
      const optionItem = within(dialog).getByText('React.js');
      await user.click(optionItem);

      expect(onValueChange).toHaveBeenCalledWith(['vue']);
    });

    it('removes item when remove button (X) on badge is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <MultiDataSelect
          options={options}
          value={['react', 'vue']}
          onValueChange={onValueChange}
        />,
      );

      const removeButtons = screen.getAllByRole('button');
      await user.click(removeButtons[0]);

      expect(onValueChange).toHaveBeenCalledWith(['vue']);
    });

    it('does not select disabled option', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <MultiDataSelect
          options={options}
          value={[]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const dialog = screen.getByRole('dialog');
      const disabledOption = within(dialog).getByText('Angular');
      await user.click(disabledOption);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    it('filters options locally when search input changes', async () => {
      const user = userEvent.setup();

      render(<MultiDataSelect options={options} searchable={true} />);

      await user.click(screen.getByRole('combobox'));

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'React');

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('React.js')).toBeInTheDocument();
      expect(within(dialog).queryByText('Vue.js')).not.toBeInTheDocument();
    });

    it('calls onSearchChange handler when searching in server mode', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();

      render(
        <MultiDataSelect
          options={options}
          searchable={true}
          onSearchChange={onSearchChange}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'Vue');

      expect(onSearchChange).toHaveBeenCalled();
    });

    it('shows emptyMessage when search yields no options', async () => {
      const user = userEvent.setup();

      render(
        <MultiDataSelect
          options={options}
          searchable={true}
          emptyMessage="No framework found"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'Svelte');

      expect(screen.getByText('No framework found')).toBeInTheDocument();
    });
  });

  describe('Loading & Disabled States', () => {
    it('shows loader and hides options when isLoading is true', async () => {
      const user = userEvent.setup();

      render(<MultiDataSelect options={options} isLoading={true} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('React.js')).not.toBeInTheDocument();
    });

    it('disables trigger when disabled prop is true', () => {
      render(<MultiDataSelect options={options} disabled={true} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Pagination', () => {
    const paginationConfig = {
      page: 1,
      pageSize: 2,
      total: 5,
      onPageChange: vi.fn(),
    };

    it('renders pagination control and page status correctly', async () => {
      const user = userEvent.setup();

      render(
        <MultiDataSelect options={options} pagination={paginationConfig} />,
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('triggers onPageChange when pagination buttons are clicked', async () => {
      const user = userEvent.setup();

      render(
        <MultiDataSelect options={options} pagination={paginationConfig} />,
      );

      await user.click(screen.getByRole('combobox'));

      const dialog = screen.getByRole('dialog');
      const buttons = within(dialog).getAllByRole('button');
      const nextButton = buttons[buttons.length - 1];

      await user.click(nextButton);

      expect(paginationConfig.onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables previous button on first page', async () => {
      const user = userEvent.setup();

      render(
        <MultiDataSelect options={options} pagination={paginationConfig} />,
      );

      await user.click(screen.getByRole('combobox'));

      const dialog = screen.getByRole('dialog');
      const buttons = within(dialog).getAllByRole('button');
      const prevButton = buttons[buttons.length - 2];

      expect(prevButton).toBeDisabled();
    });
  });
});
