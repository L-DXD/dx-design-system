import { LitElement, nothing, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import type { IconNode } from 'lucide';
import { defineElement } from '../utils/define-element.js';

/**
 * kebab-case → PascalCase 변환
 * 예: "chevron-down" → "ChevronDown"
 */
function kebabToPascal(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Lucide IconNode를 SVG HTML 문자열로 변환.
 * stroke/fill은 currentColor 사용 → Tailwind text-* 클래스로 색상 제어 가능.
 * width/height는 기본 1em → Tailwind w-*, h-*, font-size 모두 지원.
 */
function iconNodeToSvg(node: IconNode): string {
  const children = node
    .map(([tag, props]) => {
      const attrs = Object.entries(props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      return `<${tag} ${attrs}/>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

const iconCache = new Map<string, string>();

async function resolveIcon(name: string): Promise<string | null> {
  const cached = iconCache.get(name);
  if (cached !== undefined) return cached;

  try {
    const mod = (await import('lucide')) as unknown as Record<string, IconNode>;
    const iconNode = mod[kebabToPascal(name)];
    if (!iconNode) return null;
    const svg = iconNodeToSvg(iconNode);
    iconCache.set(name, svg);
    return svg;
  } catch {
    return null;
  }
}

/**
 * <ds-icon name="check" class="w-6 h-6 text-red-500"></ds-icon>
 *
 * Light DOM 렌더링으로 Tailwind 유틸리티 클래스가 내부 SVG에 직접 적용된다.
 * Lucide Icons를 사용하며, name은 kebab-case로 전달.
 */
export class DsIcon extends LitElement {
  @property({ type: String }) name = '';

  createRenderRoot() {
    return this;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('name')) {
      void this.#loadIcon();
    }
  }

  async #loadIcon(): Promise<void> {
    if (!this.name) {
      this.innerHTML = '';
      return;
    }

    const svg = await resolveIcon(this.name);
    if (svg === null) {
      this.innerHTML = '';
      console.warn(`[ds-icon] Unknown icon: "${this.name}"`);
      return;
    }

    this.innerHTML = svg;
  }

  protected render() {
    return nothing;
  }
}

defineElement("ds-icon", DsIcon);
