import { ReactiveElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * <ds-form-field orientation="vertical">
 *   <ds-label html-for="email">이메일</ds-label>
 *   <ds-input id="email" type="email"></ds-input>
 *   <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
 *   <ds-error-message>유효하지 않은 이메일입니다</ds-error-message>
 * </ds-form-field>
 *
 * Compound 패턴의 컨테이너. children 을 수직/수평으로 배열하고 일관된 간격을 준다.
 * 스타일은 @dx/styles/form.css 에서 `[orientation="horizontal"]` attribute 선택자로 제어.
 *
 * React 소비자가 `<FormField orientation="horizontal">` 로 쓸 수 있도록 @property 로 타입 노출.
 * children 을 그대로 두어야 하므로 ReactiveElement 를 상속 (LitElement 는 render() 가 덮음).
 */
@customElement('ds-form-field')
export class DsFormField extends ReactiveElement {
  @property({ reflect: true })
  orientation: 'vertical' | 'horizontal' = 'vertical';

  // Light DOM 렌더. ReactiveElement 기본값은 빈 Shadow DOM 생성이라
  // slot 없이 children 을 받는 Compound 컨테이너에서는 children 이 사라진다.
  protected override createRenderRoot(): HTMLElement {
    return this;
  }
}
