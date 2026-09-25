import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './GuestRoute';
import { useCurrentUser } from '@/hooks/useCurrentUser';

vi.mock('@/hooks/useCurrentUser');
vi.mock('./FullPageLoader', () => ({
  FullPageLoader: () => <div data-testid="full-page-loader">Loading...</div>,
}));

const mockedUseCurrentUser = vi.mocked(useCurrentUser);

describe('GuestRoute Component', () => {
  it('renders FullPageLoader when authentication state is loading', () => {
    mockedUseCurrentUser.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
    } as ReturnType<typeof useCurrentUser>);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Target Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('full-page-loader')).toBeInTheDocument();
    expect(screen.queryByText('Login Target Content')).not.toBeInTheDocument();
  });

  it('redirects to /students when user is authenticated', () => {
    mockedUseCurrentUser.mockReturnValue({
      data: { uid: '123' },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as ReturnType<typeof useCurrentUser>);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Target Content</div>} />
          </Route>
          <Route
            path="/students"
            element={<div>Protected Students Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Students Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Target Content')).not.toBeInTheDocument();
  });

  it('renders Outlet (child content) when user is unauthenticated', () => {
    mockedUseCurrentUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as ReturnType<typeof useCurrentUser>);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Target Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Target Content')).toBeInTheDocument();
  });
});
