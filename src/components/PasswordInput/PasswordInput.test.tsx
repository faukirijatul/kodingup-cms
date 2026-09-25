import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput Component', () => {
  it('renders input with type="password" by default', () => {
    render(<PasswordInput placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards props and ref correctly to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} placeholder="Enter password" disabled />);

    const input = screen.getByPlaceholderText('Enter password');

    expect(input).toBeDisabled();
    expect(ref.current).toBe(input);
  });
});
