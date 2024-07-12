'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, CardHeader } from '@nextui-org/react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email) return '이메일을 입력해주세요.';
    if (!email.includes('@')) return '이메일 주소에는 @ 기호가 포함되어야 합니다.';
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) return '유효한 이메일 주소를 입력해주세요.';
    if (email.length > 100) return '이메일은 100자를 초과할 수 없습니다.';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';
    if (password.length > 20) return '비밀번호는 20자를 초과할 수 없습니다.';
    let count = 0;
    if (/[A-Z]/.test(password)) count++;
    if (/[a-z]/.test(password)) count++;
    if (/[0-9]/.test(password)) count++;
    if (/[^A-Za-z0-9]/.test(password)) count++;
    if (count < 3) return '비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.';
    return '';
  };

  const validateUsername = (username: string) => {
    if (!username) return '사용자 이름을 입력해주세요.';
    if (username.length < 3) return '사용자 이름은 최소 3자 이상이어야 합니다.';
    if (username.length > 20) return '사용자 이름은 20자를 초과할 수 없습니다.';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return '사용자 이름은 영문, 숫자, 언더스코어(_)만 포함할 수 있습니다.';
    return '';
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = validateUsername(username);

    const errors = [];
    if (emailError) errors.push(emailError);
    if (passwordError) errors.push(passwordError);
    if (usernameError) errors.push(usernameError);

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      router.push('/todos');
    } catch (error) {
      console.error('Signup error:', error);
      alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold">회원가입</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="email"
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="비밀번호"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="text"
              label="사용자 이름"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit" color="primary" className="w-full">
              회원가입
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}