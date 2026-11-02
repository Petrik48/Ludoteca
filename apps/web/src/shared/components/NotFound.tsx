import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@ludoteca/ui-kit';
import emptyPageImg from '@/assets/images/empty-page.png';

interface NotFoundProps {
  title: string;
  description: string;
  statusCode?: string;
}

export function NotFound({ title, description, statusCode }: NotFoundProps) {
  return (
    <div className="flex flex-col gap-5 items-center max-w-[420px] text-center">
      <img src={emptyPageImg} alt="" width="200" height="200" decoding="async" />
      {statusCode && <span className="text-primary text-sm font-semibold">{statusCode}</span>}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm font-normal text-foreground">{description}</p>
      <Link to="/games" className={buttonVariants()}>
        <ChevronLeft size="16" aria-hidden="true" />
        Back to library
      </Link>
    </div>
  );
}
