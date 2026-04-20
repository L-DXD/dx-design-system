import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn/ui 의 `cn` 유틸.
 * clsx + tailwind-merge: 조건부 class 조합 + 충돌 시 뒤 것이 이기도록 병합.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
