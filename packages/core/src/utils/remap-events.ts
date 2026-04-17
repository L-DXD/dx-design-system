export function remapEvents(el: HTMLElement, eventMap: Record<string, string>) {
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
