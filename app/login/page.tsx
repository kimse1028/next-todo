'use client';

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from "@firebase/app";

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

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/disallowed-useragent') {
          alert("죄송합니다. 현재 사용 중인 브라우저에서는 Google 로그인이 지원되지 않습니다. 다른 로그인 방법을 사용하거나 최신 브라우저로 업데이트해 주세요.");
        } else {
          alert(`로그인 중 오류가 발생했습니다: ${error.message}`);
        }
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
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
      <Button onClick={signIn}>Google로 로그인</Button>
      <p>계정이 없으신가요? <Link href="/signup">회원가입</Link></p>
    </>
  );
}