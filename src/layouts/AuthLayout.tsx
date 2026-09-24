import { Outlet } from 'react-router-dom';
import { KodingUpLogo } from '@/components/icons/KodingUpLogo';

export function AuthLayout() {
  return (
    <div className="bg-bg-primary text-white-primary flex min-h-screen">
      <div className="flex w-full items-center justify-center">
        <Outlet />
      </div>

      <div className="flex h-screen w-full items-center justify-center p-5">
        <div className="border-dark flex h-full w-full flex-col gap-7 rounded-lg border">
          <div className="flex flex-col p-16">
            <span className="mb-4 block">
              <KodingUpLogo />
            </span>
            <h2 className="mb-3 text-2xl leading-8 font-semibold">
              Secure Access Portal
            </h2>

            <p className="w-90 text-base leading-6 font-medium">
              Continue your learning journey and master the skills that matter.
            </p>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-b-lg">
            <div className="from-bg-primary absolute inset-0 z-10 bg-linear-to-b to-transparent"></div>

            <img
              src="/images/auth-hero.webp"
              alt="Auth Hero Image"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
