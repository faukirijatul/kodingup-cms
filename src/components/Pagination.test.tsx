import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    onPageChange: vi.fn(),
    onRowsPerPageChange: vi.fn(),
  };

  describe('Row Info & Basic Rendering', () => {
    it('renders row range and total items correctly', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('1 - 10 of 50')).toBeInTheDocument();
      expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('calculates correct range on subsequent pages', () => {
      render(<Pagination {...defaultProps} currentPage={2} />);

      expect(screen.getByText('11 - 20 of 50')).toBeInTheDocument();
    });

    it('handles last page range when totalItems is not a multiple of rowsPerPage', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalItems={42} />);

      expect(screen.getByText('41 - 42 of 42')).toBeInTheDocument();
    });

    it('renders 0 - 0 of 0 when totalItems is 0', () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          totalPages={0}
          totalItems={0}
        />,
      );

      expect(screen.getByText('0 - 0 of 0')).toBeInTheDocument();
    });
  });

  describe('Page Navigation Interactivity', () => {
    it('disables previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[buttons.length - 1];

      expect(nextButton).toBeDisabled();
    });

    it('calls onPageChange with previous page number when previous button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={3}
          onPageChange={onPageChange}
        />,
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with next page number when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          currentPage={2}
          onPageChange={onPageChange}
        />,
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[buttons.length - 1]);

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange when a specific page button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const page3Button = screen.getByRole('button', { name: '3' });
      await user.click(page3Button);

      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Ellipsis Logic', () => {
    it('renders all page numbers when totalPages is 7 or less', () => {
      render(<Pagination {...defaultProps} totalPages={7} />);

      for (let i = 1; i <= 7; i++) {
        expect(
          screen.getByRole('button', { name: String(i) }),
        ).toBeInTheDocument();
      }
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('renders ellipsis when totalPages is greater than 7', () => {
      render(<Pagination {...defaultProps} totalPages={10} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: '6' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Rows Per Page Select', () => {
    it('calls onRowsPerPageChange when a new option is selected from Radix Select', async () => {
      const user = userEvent.setup();
      const onRowsPerPageChange = vi.fn();

      render(
        <Pagination
          {...defaultProps}
          onRowsPerPageChange={onRowsPerPageChange}
        />,
      );

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      const option20 = await screen.findByRole('option', { name: '20' });
      await user.click(option20);

      expect(onRowsPerPageChange).toHaveBeenCalledTimes(1);
      expect(onRowsPerPageChange).toHaveBeenCalledWith(20);
    });
  });
});
