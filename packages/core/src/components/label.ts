import { ReactiveElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

/**
 * <ds-label html-for="email" required>이메일</ds-label>
 *
 * Light DOM + 텍스트 컨텐츠를 그대로 유지해야 하므로 render() 가 children 을 덮어쓰지 않는
 * ReactiveElement 를 상속한다 (LitElement 는 template 렌더가 children 을 지움).
 *
 * - `html-for` 속성이 있으면 클릭 시 해당 ID 의 요소에 포커스를 준다.
 * - `required` 가 있으면 `*` 표시를 자동 추가한다.
 *
 * React 소비자는 `<Label htmlFor="email" required>` 로 쓸 수 있도록 @property 로 타입을 노출.
 */
@customElement('ds-label')
export class DsLabel extends ReactiveElement {
  @property({ attribute: 'html-for', reflect: true })
  htmlFor = '';

  @property({ type: Boolean, reflect: true })
  required = false;

  #markerEl: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#handleClick);
    super.disconnectedCallback();
  }

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has('required')) {
      this.#syncRequiredMarker();
    }
  }

  #handleClick = (event: Event): void => {
    if (!this.htmlFor) return;
    if (event.target === this.#markerEl) return;
    const target = document.getElementById(this.htmlFor);
    if (target && typeof (target as HTMLElement).focus === 'function') {
      (target as HTMLElement).focus();
    }
  };

  #syncRequiredMarker(): void {
    if (this.required && !this.#markerEl) {
      const marker = document.createElement('span');
      marker.className = 'ds-required-marker';
      marker.setAttribute('aria-label', '필수');
      marker.textContent = '*';
      this.appendChild(marker);
      this.#markerEl = marker;
    } else if (!this.required && this.#markerEl) {
      this.#markerEl.remove();
      this.#markerEl = null;
    }
  }
}
