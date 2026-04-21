import { twMerge } from 'tailwind-merge';

const MOVE_TO_INNER = new Set([
  'id', 'name', 'value', 'type', 'placeholder',
  'disabled', 'required', 'readonly',
  'min', 'max', 'step', 'pattern', 'minlength', 'maxlength',
  'autocomplete', 'autofocus', 'inputmode', 'spellcheck',
  'form', 'for', 'role',
]);

const isAriaAttr = (name: string) => name.startsWith('aria-');

export abstract class DxElement extends HTMLElement {
  protected inner?: HTMLElement;
  protected abstract getBaseClasses(): string;
  protected abstract renderInternal(): HTMLElement;

  static get observedAttributes(): string[] {
    return ['class', 'variant', 'size', 'disabled', 'required', 'value', 'placeholder'];
  }

  connectedCallback(): void {
    if (this.inner) return;
    const inner = this.renderInternal();
    this.inner = inner;

    const userClass = this.getAttribute('class') ?? '';
    inner.className = twMerge(this.getBaseClasses(), userClass);
    this.removeAttribute('class');

    for (const name of this.getAttributeNames()) {
      if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
        inner.setAttribute(name, this.getAttribute(name) ?? '');
        this.removeAttribute(name);
      }
    }

    while (this.firstChild) {
      inner.appendChild(this.firstChild);
    }

    this.appendChild(inner);
    this.style.display = 'contents';
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    if (!this.inner) return;
    if (name === 'class') {
      this.inner.className = twMerge(this.getBaseClasses(), value ?? '');
      this.removeAttribute('class');
      return;
    }
    if (name === 'variant' || name === 'size') {
      this.inner.className = twMerge(this.getBaseClasses(), '');
      return;
    }
    if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
      if (value === null) this.inner.removeAttribute(name);
      else this.inner.setAttribute(name, value);
      this.removeAttribute(name);
    }
  }
}
