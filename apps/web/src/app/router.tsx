import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/layouts';

const GamesLibraryPage = lazy(() => import('../features/games/pages/GamesLibraryPage'));
const GameCardPage = lazy(() => import('../features/game/pages/GameCardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Navigate to="/games" replace /> },
      {
        path: '/games',
        element: <GamesLibraryPage />,
      },
      {
        path: '/games/:id',
        element: <GameCardPage />,
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
