import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn/ui 관례의 `cn` 유틸.
 * - clsx: 조건부 class 문자열 조합
 * - tailwind-merge: 충돌하는 Tailwind class 를 자동으로 뒤 것이 이기도록 병합
 *
 * 예: cn("px-2 py-1", disabled && "opacity-50", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
