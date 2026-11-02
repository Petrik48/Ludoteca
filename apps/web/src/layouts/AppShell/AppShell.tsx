import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="flex flex-col bg-secondary py-12 px-6 min-h-screen">
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div role="status">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
