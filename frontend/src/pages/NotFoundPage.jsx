import { Link } from 'react-router-dom';
import { Button } from '../components/common';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">404</h1>
        <p className="mt-2 text-lg font-medium text-gray-900">Page not found</p>
        <p className="mt-2 text-base text-gray-500 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link to="/">
          <Button size="lg">Return to Homepage</Button>
        </Link>
      </div>
    </div>
  );
};
