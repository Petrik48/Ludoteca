import { Link } from 'react-router-dom';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ludoteca/ui-kit';
import { GameTypeBadge } from '@/shared/components';
import { GameDto, gameTypeConfig } from '@/shared/types';
import { formatDate } from '@/shared/utils';

interface GamesTableProps {
  games: GameDto[];
  onEdit: (game: GameDto) => void;
  onDelete: (game: GameDto) => void;
}

export function GamesTable({ games, onEdit, onDelete }: GamesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Added</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={`${game.name}_${game.createdAt}`}>
            <TableCell>
              <Link to={`/games/${game.id}`} className="text-primary hover:text-primary-hover">
                {game.name}
              </Link>
            </TableCell>
            <TableCell>
              <GameTypeBadge
                variant={gameTypeConfig[game.type].className}
                label={gameTypeConfig[game.type].label}
              />
            </TableCell>
            <TableCell>{formatDate(game.createdAt)}</TableCell>
            <TableCell className="w-[100px] text-muted-foreground">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button aria-label="Game actions">
                      <MoreVertical />
                    </button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="text-secondary-foreground"
                      onClick={() => onEdit(game)}
                    >
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(game)}>
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
