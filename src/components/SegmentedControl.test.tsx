import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl Component', () => {
  const mockSegments = [
    { label: 'Overview', value: 1 },
    { label: 'Analytics', value: 2 },
    { label: 'Settings', value: 3 },
  ];

  const defaultProps = {
    segments: mockSegments,
    selectedSegment: 1,
    onSelectSegment: vi.fn(),
  };

  it('renders all segment options correctly', () => {
    render(<SegmentedControl {...defaultProps} />);

    mockSegments.forEach((segment) => {
      expect(
        screen.getByRole('button', { name: segment.label }),
      ).toBeInTheDocument();
    });
  });

  it('applies active styles to the selected segment and inactive styles to others', () => {
    render(<SegmentedControl {...defaultProps} selectedSegment={2} />);

    const activeSegment = screen.getByRole('button', { name: 'Analytics' });
    const inactiveSegment = screen.getByRole('button', { name: 'Overview' });

    expect(activeSegment).toHaveClass('text-blue border-blue border-b-2');
    expect(activeSegment).not.toHaveClass('text-muted hover:text-white');

    expect(inactiveSegment).toHaveClass('text-muted hover:text-white');
    expect(inactiveSegment).not.toHaveClass('text-blue border-blue border-b-2');
  });

  it('calls onSelectSegment with the correct value when a segment is clicked', async () => {
    const user = userEvent.setup();
    const handleSelectSegment = vi.fn();

    render(
      <SegmentedControl
        {...defaultProps}
        onSelectSegment={handleSelectSegment}
      />,
    );

    const settingsButton = screen.getByRole('button', { name: 'Settings' });
    await user.click(settingsButton);

    expect(handleSelectSegment).toHaveBeenCalledTimes(1);
    expect(handleSelectSegment).toHaveBeenCalledWith(3);
  });

  it('renders correctly with an empty segments array', () => {
    render(
      <SegmentedControl
        segments={[]}
        selectedSegment={1}
        onSelectSegment={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
