import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="bg-secondary py-12 px-6 min-h-screen">
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
