import emptyPlaysImg from '@/assets/images/empty-plays.png';

export function EmptyPlays() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 rounded-xl bg-background">
      <img src={emptyPlaysImg} alt="" width="180" height="180" decoding="async" />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-base font-medium text-secondary-foreground">No plays yet</p>
        <p className="text-sm font-normal text-muted-foreground">
          Record your first play to start tracking your gaming sessions.
        </p>
      </div>
    </div>
  );
}
