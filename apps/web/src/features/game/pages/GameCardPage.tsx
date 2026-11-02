import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { GameTypeBadge, NotFound } from '@/shared/components';
import { gameTypeConfig } from '@/shared/types';
import { formatDate } from '@/shared/utils';
import { useGame } from '../hooks/useGame.ts';
import { EmptyPlays } from '../components/EmptyPlays.tsx';
import { ApiError } from '@/shared/api';

export default function GameCardPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFound title="Game not found" description="This game may have been deleted." />;
  }

  return <GameCard id={id} />;
}

function GameCard({ id }: { id: string }) {
  const { data: game, isPending, error } = useGame(id);

  if (isPending) return <div>Loading…</div>;

  if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <NotFound title="Game not found" description="This game may have been deleted." />
      </div>
    );
  }

  if (error) return <div role="alert">Error loading game</div>;

  if (!game) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[960px] mx-auto">
      <div className="flex flex-col gap-6">
        <nav aria-label="Breadcrumb">
          <Link to="/games" className="flex items-center gap-1.5 text-muted-foreground">
            <ChevronLeft size="16" aria-hidden="true" />
            Back to library
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{game.name}</h1>
        <GameTypeBadge
          variant={gameTypeConfig[game.type].className}
          label={gameTypeConfig[game.type].label}
        />
      </div>
      <p className="text-sm font-normal text-muted-foreground">
        Added {formatDate(game.createdAt)}
      </p>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Plays</h2>
        <EmptyPlays />
      </div>
    </div>
  );
}
