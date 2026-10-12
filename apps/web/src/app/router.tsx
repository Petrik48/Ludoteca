import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/layouts';

const GamesLibraryPage = lazy(() => import('../features/games/pages/GamesLibraryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <GamesLibraryPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
