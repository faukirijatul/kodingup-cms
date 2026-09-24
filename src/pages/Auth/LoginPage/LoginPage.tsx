import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  return (
    <div className="border-dark w-99.5 rounded-lg border p-6">
      <h1 className="mb-5 text-center text-2xl leading-8 font-semibold tracking-[-0.6px]">
        Sign In
      </h1>

      <LoginForm />
    </div>
  );
}
