'use client';

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { signInWithGoogle } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/todos');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/todos');
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다. 다시 시도해 주세요.');
    }
  };

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
    <>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      <Button onClick={handleGoogleLogin}>Google로 로그인</Button>
      <p>계정이 없으신가요? <Link href="/signup">회원가입</Link></p>
    </>
  );
}