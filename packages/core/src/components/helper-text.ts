/**
 * <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
 *
 * 입력창 하단의 설명 텍스트. muted-foreground 색상의 작은 글씨.
 * 스타일은 @dx/styles의 form.css에서 관리.
 */
export class DsHelperText extends HTMLElement {}

if (!customElements.get('ds-helper-text')) {
  customElements.define('ds-helper-text', DsHelperText);
}
