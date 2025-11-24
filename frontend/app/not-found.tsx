"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
      <Card className='w-full max-w-md bg-white'>
        <CardContent className='p-8 text-center'>
          <div className='mb-6'>
            <h1 className='text-6xl font-bold text-gray-300 mb-2'>404</h1>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Page Not Found
            </h2>
            <p className='text-gray-600'>
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          <div className='space-y-3'>
            <Link href='/'>
              <Button className='w-full'>
                <Home className='h-4 w-4 mr-2' />
                Go to Dashboard
              </Button>
            </Link>
            <Button
              variant='outline'
              onClick={() => window.history.back()}
              className='w-full bg-transparent'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
