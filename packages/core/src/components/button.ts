import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';

export class DsButton extends SlButton {}

if (!customElements.get('ds-button')) {
  customElements.define('ds-button', DsButton);
}
