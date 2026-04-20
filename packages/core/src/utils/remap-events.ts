// host 타입을 느슨하게 둔다. Shoelace .d.ts 의 autocorrect 필드가 DOM 표준과 충돌해
// 엄격한 HTMLElement 로 받으면 Shoelace 기반 컴포넌트를 넘길 때 타입 오류가 난다.
// 이 함수는 addEventListener / dispatchEvent 만 쓴다.
export function remapEvents(el: EventTarget, eventMap: Record<string, string>) {
  for (const [slEvent, dsEvent] of Object.entries(eventMap)) {
    el.addEventListener(slEvent, (e: Event) => {
      const ce = e as CustomEvent;
      el.dispatchEvent(new CustomEvent(dsEvent, {
        detail: ce.detail,
        bubbles: true,
        composed: true,
      }));
    });
  }
}
