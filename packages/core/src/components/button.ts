import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';

export class DsButton extends SlButton {
  // Shadow DOM disabled — allows external Tailwind class overrides
  static createRenderRoot() {
    return this;
  }
}

if (!customElements.get('ds-button')) {
  customElements.define('ds-button', DsButton);
}
