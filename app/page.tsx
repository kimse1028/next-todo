'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div>
      {user ? (
        <>
          <p>Loading . . .</p>
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
}