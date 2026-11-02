import { NotFound } from '@/shared/components';

export default function NotFoundPage() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <NotFound
        title="Page not found"
        description="The link may be broken, or this page doesn’t exist."
        statusCode="404"
      />
    </main>
  );
}
