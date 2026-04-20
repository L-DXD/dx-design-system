import { ReactiveElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * <ds-badge variant="primary">NEW</ds-badge>
 *
 * 순수 프레젠테이션 컴포넌트이므로 Shadow DOM 을 쓰지 않고 Light DOM 으로 둔다.
 * 이유: Tailwind 유틸 class(`px-4`, `bg-*`, `rounded-*`, `text-*`) 를 소비자가 직접
 * 걸었을 때 실제 시각 박스에 그대로 적용되어야 함. Shadow DOM 으로 감싸면 host 에는
 * 여백만 생기고 내부 박스는 변하지 않아 기대와 어긋난다.
 *
 * 기본 스타일은 @dx/styles 의 shoelace.css 에서 `ds-badge[variant='...']` 속성 선택자로 부여.
 */
@customElement('ds-badge')
export class DsBadge extends ReactiveElement {
  @property({ reflect: true })
  variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary';

  @property({ type: Boolean, reflect: true })
  pill = false;

  @property({ type: Boolean, reflect: true })
  pulse = false;
}
