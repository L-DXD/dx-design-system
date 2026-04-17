/**
 * <ds-label html-for="email" required>이메일</ds-label>
 *
 * Light DOM 방식으로 구현하여 자식 텍스트를 그대로 유지한다.
 * `html-for` 속성이 있으면 클릭 시 해당 ID의 요소에 포커스를 준다.
 * `required`가 있으면 `*` 표시를 자동 추가한다.
 */
export class DsLabel extends HTMLElement {
  #markerEl: HTMLSpanElement | null = null;

  connectedCallback(): void {
    this.addEventListener('click', this.#handleClick);
    this.#syncRequiredMarker();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.#handleClick);
  }

  static get observedAttributes(): string[] {
    return ['required'];
  }

  attributeChangedCallback(name: string): void {
    if (name === 'required') this.#syncRequiredMarker();
  }

  #handleClick = (event: Event): void => {
    const htmlFor = this.getAttribute('html-for');
    if (!htmlFor) return;
    if (event.target === this.#markerEl) return;
    const target = document.getElementById(htmlFor);
    if (target && typeof (target as HTMLElement).focus === 'function') {
      (target as HTMLElement).focus();
    }
  };

  #syncRequiredMarker(): void {
    const isRequired = this.hasAttribute('required');
    if (isRequired && !this.#markerEl) {
      const marker = document.createElement('span');
      marker.className = 'ds-required-marker';
      marker.setAttribute('aria-label', '필수');
      marker.textContent = '*';
      this.appendChild(marker);
      this.#markerEl = marker;
    } else if (!isRequired && this.#markerEl) {
      this.#markerEl.remove();
      this.#markerEl = null;
    }
  }
}

if (!customElements.get('ds-label')) {
  customElements.define('ds-label', DsLabel);
}
