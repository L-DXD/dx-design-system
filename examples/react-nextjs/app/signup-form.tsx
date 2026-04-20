"use client";

// Web Component 는 브라우저 API 에 의존하므로, 이 리프 컴포넌트만 클라이언트로 분리한다.
// page.tsx / layout.tsx 는 RSC 로 그대로 서버 렌더링된다.

import {
  Button,
  Checkbox,
  FormField,
  HelperText,
  Input,
  Label,
} from "@dx/react";
import { useState } from "react";

export function SignupForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(`가입 요청: ${email}`);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <FormField>
        <Label htmlFor="email" required>
          이메일
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <HelperText>회사 이메일을 입력하세요</HelperText>
      </FormField>

      <FormField>
        <Label htmlFor="password" required>
          비밀번호
        </Label>
        <Input id="password" type="password" />
      </FormField>

      <FormField orientation="horizontal">
        <Checkbox id="terms" />
        <Label htmlFor="terms">이용약관에 동의합니다</Label>
      </FormField>

      <Button type="submit" variant="primary">
        가입하기
      </Button>
    </form>
  );
}
