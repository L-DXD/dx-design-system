'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  ErrorMessage,
  FormField,
  HelperText,
  Input,
  Label,
} from '@dx/ui';

export default function Page() {
  const [email, setEmail] = useState('');

  return (
    <main className="max-w-2xl mx-auto flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-bold m-0">DX Design System</h1>
        <p className="text-muted-foreground mt-2">shadcn/ui 기반 — 기본 / Token 오버라이드 / Tailwind 오버라이드</p>
      </header>

      {/* 1. 기본 */}
      <section className="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">1. 기본 사용</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`가입: ${email}`);
          }}
          className="flex flex-col gap-4"
        >
          <FormField>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <HelperText>회사 이메일을 입력하세요</HelperText>
          </FormField>

          <FormField>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" />
            <ErrorMessage>{email === 'bad@example.com' ? '사용할 수 없는 이메일' : ''}</ErrorMessage>
          </FormField>

          <FormField orientation="horizontal">
            <Checkbox id="terms" />
            <Label htmlFor="terms">이용약관에 동의합니다</Label>
          </FormField>

          <Button type="submit" variant="primary">가입하기</Button>
        </form>
      </section>

      {/* 2. Token 오버라이드 — 브랜드 컬러 */}
      <section className="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">2. Token 오버라이드</h2>
        <p className="text-sm text-muted-foreground">
          wrapper 에 `--color-primary` CSS 변수만 재선언. 하위 컴포넌트 전부 새 컬러 따라감.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemeCard label="기본" style={{}} />
          <ThemeCard label="Purple" style={{ '--color-primary': '#8b5cf6', '--color-ring': '#8b5cf6' } as React.CSSProperties} />
          <ThemeCard label="Emerald" style={{ '--color-primary': '#10b981', '--color-ring': '#10b981' } as React.CSSProperties} />
        </div>
      </section>

      {/* 3. Tailwind 오버라이드 — 실제 박스에 적용됨 (shadcn 은 Light DOM) */}
      <section className="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">3. Tailwind className 오버라이드</h2>
        <p className="text-sm text-muted-foreground">
          shadcn 은 네이티브 `&lt;button&gt;`/`&lt;input&gt;` 이므로 className 이 실제 요소에
          그대로 적용. padding·rounded·bg 모두 바로 먹음.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button>기본</Button>
          <Button className="w-full">w-full</Button>
          <Button className="w-full mt-2 shadow-lg rounded-full">rounded-full shadow-lg</Button>
          <Button variant="outline" className="bg-yellow-100 hover:bg-yellow-200">
            bg 완전 override
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <Badge>기본</Badge>
          <Badge className="text-base px-6 py-2">text-base px-6 py-2</Badge>
          <Badge variant="outline" className="rounded-full">rounded-full</Badge>
        </div>

        <Input type="email" placeholder="border-2 border-primary" className="border-2 border-primary" />
      </section>
    </main>
  );
}

function ThemeCard({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border" style={style}>
      <Badge>{label}</Badge>
      <FormField>
        <Label htmlFor={`e-${label}`}>이메일</Label>
        <Input id={`e-${label}`} type="email" placeholder="name@company.com" />
      </FormField>
      <FormField orientation="horizontal">
        <Checkbox id={`a-${label}`} />
        <Label htmlFor={`a-${label}`}>동의</Label>
      </FormField>
      <Button>가입</Button>
    </div>
  );
}
