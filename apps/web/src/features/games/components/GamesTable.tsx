import { MoreVertical, Pencil, Trash } from 'lucide-react';

import { GameDto } from '../types';
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
import { GameTypeBadge } from './GameTypeBadge.tsx';

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
            <TableCell>{game.name}</TableCell>
            <TableCell>
              <GameTypeBadge gameType={game.type} />
            </TableCell>
            <TableCell>{game.createdAt}</TableCell>
            <TableCell className="w-[100px] text-muted-foreground">
              <DropdownMenu>
                <DropdownMenuTrigger render={<MoreVertical />}>Open</DropdownMenuTrigger>
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
