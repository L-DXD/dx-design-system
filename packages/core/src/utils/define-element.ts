// CustomElementConstructor 는 HTMLElement 생성자를 요구하지만, Shoelace 기반 컴포넌트는
// 자체 .d.ts 의 일부 속성(예: autocorrect) 타입이 DOM 표준과 충돌하는 문제가 있어
// 엄격한 타입 체크 시 등록 실패. 이 헬퍼는 register-if-absent 로직 + 타입 캐스팅을 모아둔다.
export function defineElement(
  name: string,
  ctor: new (...args: never[]) => object,
): void {
  if (!customElements.get(name)) {
    customElements.define(name, ctor as unknown as CustomElementConstructor);
  }
}
