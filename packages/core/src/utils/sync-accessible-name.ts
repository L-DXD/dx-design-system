/**
 * Shadow DOM 내부 폼 컨트롤의 접근성 이름 동기화.
 *
 * Why: DS는 Shoelace의 `label` prop을 쓰지 않고 외부 `<ds-label html-for="X">`로
 *      label을 조립한다. 그러나 `<label for="X">`는 커스텀 엘리먼트 호스트를 가리킬 뿐,
 *      Shadow DOM 내부 `<input>`에는 연결되지 않는다. 결과적으로 axe-core가
 *      `label` / `label-title-only` violation을 발생시킨다.
 *
 * 해결: 호스트의 `id`와 매칭되는 `<ds-label html-for="id">`의 텍스트를 찾아
 *       내부 컨트롤에 `aria-label`로 반영하고, 빈 `title=""` 잔존 속성을 제거한다.
 *       라벨 텍스트가 바뀌면 MutationObserver로 재동기화한다.
 */
// host 타입을 느슨하게 둔다(structural). Shoelace 자체 .d.ts 의 일부 속성(예: autocorrect)이
// DOM 표준과 충돌하는 문제가 있어, 엄격한 `HTMLElement` 로 받으면 Shoelace 기반 컴포넌트를
// 넘길 때 타입 오류가 난다. 이 함수는 getAttribute / shadowRoot 만 요구한다.
type AccessibleHost = Element & {
  shadowRoot: ShadowRoot | null;
  getAttribute(name: string): string | null;
};

export function syncAccessibleName(
  host: AccessibleHost,
  internalSelector: string,
): () => void {
  let observer: MutationObserver | null = null;

  const apply = () => {
    const root = host.shadowRoot;
    if (!root) return;
    const control = root.querySelector(internalSelector) as HTMLElement | null;
    if (!control) return;

    if (control.getAttribute('title') === '') control.removeAttribute('title');

    const id = host.getAttribute('id');
    if (!id) return;
    const label = document.querySelector(
      `ds-label[html-for="${CSS.escape(id)}"]`,
    ) as HTMLElement | null;
    if (!label) return;
    const text = (label.textContent ?? '').replace(/\*$/u, '').trim();
    if (text) control.setAttribute('aria-label', text);
  };

  const schedule = () => queueMicrotask(apply);

  schedule();

  const id = host.getAttribute('id');
  if (id) {
    const label = document.querySelector(
      `ds-label[html-for="${CSS.escape(id)}"]`,
    );
    if (label) {
      observer = new MutationObserver(schedule);
      observer.observe(label, { childList: true, characterData: true, subtree: true });
    }
  }

  return () => {
    observer?.disconnect();
    observer = null;
  };
}
