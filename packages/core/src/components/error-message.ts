/**
 * <ds-error-message>유효하지 않은 이메일입니다</ds-error-message>
 *
 * 유효성 검사 실패 메시지. danger 컬러 + role="alert"로 스크린 리더 즉시 안내.
 * 내용이 비어있으면 자동으로 숨겨진다(CSS `:empty`).
 */
export class DsErrorMessage extends HTMLElement {
  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alert');
    }
  }
}

if (!customElements.get('ds-error-message')) {
  customElements.define('ds-error-message', DsErrorMessage);
}
