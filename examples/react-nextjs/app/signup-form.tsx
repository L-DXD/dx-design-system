'use client';

// Web Component 는 브라우저 API 에 의존하므로, 이 리프 컴포넌트만 클라이언트로 분리한다.
// page.tsx / layout.tsx 는 RSC 로 그대로 서버 렌더링된다.

import * as DX from '@dx/react';
import { useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

/*
 * 타입 보조:
 * 현재 @dx/react Atoms 래퍼는 Lit reactive property 를 노출하지 않고 raw attribute 에만 의존한다.
 * `@lit/react` 의 createComponent 는 reactive property 가 없으면 추가 prop 을 타입에 포함시키지
 * 못하므로, 소비자가 attribute 를 JSX 로 쓰려면 이렇게 명시적으로 재타이핑해야 한다.
 *
 * CLAUDE.md 에 명시된 대로 Atoms 는 Foundation 완료 후 재정비 대상이며,
 * 그 시점에 wrapper 가 reactive property 를 노출하면 이 헬퍼는 삭제된다.
 */
type AnyProps<P = unknown> = PropsWithChildren<P & Record<string, unknown>>;

const Label = DX.Label as unknown as FC<AnyProps<{ 'html-for'?: string; required?: '' }>>;
const FormField = DX.FormField as unknown as FC<AnyProps<{ orientation?: 'vertical' | 'horizontal' }>>;
const Input = DX.Input as unknown as FC<
  AnyProps<{
    id?: string;
    type?: string;
    placeholder?: string;
    onDsInput?: (e: CustomEvent) => void;
  }>
>;
const HelperText = DX.HelperText as unknown as FC<AnyProps>;
const Checkbox = DX.Checkbox as unknown as FC<AnyProps<{ id?: string }>>;
const Button = DX.Button as unknown as FC<
  AnyProps<{ type?: string; variant?: 'primary' | 'secondary' | 'destructive' }>
>;

export function SignupForm() {
  const [email, setEmail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(`가입 요청: ${email}`);
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <FormField>
        <Label html-for="email" required="">
          이메일
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          onDsInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <HelperText>회사 이메일을 입력하세요</HelperText>
      </FormField>

      <FormField>
        <Label html-for="password" required="">
          비밀번호
        </Label>
        <Input id="password" type="password" />
      </FormField>

      <FormField orientation="horizontal">
        <Checkbox id="terms" />
        <Label html-for="terms">이용약관에 동의합니다</Label>
      </FormField>

      <Button type="submit" variant="primary">
        가입하기
      </Button>
    </form>
  );
}
