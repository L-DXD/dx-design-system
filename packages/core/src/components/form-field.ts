/**
 * <ds-form-field>
 *   <ds-label html-for="email">이메일</ds-label>
 *   <ds-input id="email" type="email"></ds-input>
 *   <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
 *   <ds-error-message>유효하지 않은 이메일입니다</ds-error-message>
 * </ds-form-field>
 *
 * Compound 패턴의 컨테이너. 자식을 수직/수평으로 배열하고 일관된 간격을 준다.
 * 동작 없는 순수 레이아웃 컴포넌트라 HTMLElement를 바로 상속한다.
 * 스타일은 @dx/styles의 form.css에서 관리.
 *
 * Attributes:
 *   - orientation: "vertical" (기본) | "horizontal"
 *     - horizontal: 체크박스/토글 등 라벨이 컨트롤 옆에 붙는 경우.
 */
export class DsFormField extends HTMLElement {}

if (!customElements.get('ds-form-field')) {
  customElements.define('ds-form-field', DsFormField);
}
