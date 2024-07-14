'use client';

import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/auth';
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

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push('/todos');
    } catch (error) {
      console.error('Google login error:', error);
      alert('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
    }
  };

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