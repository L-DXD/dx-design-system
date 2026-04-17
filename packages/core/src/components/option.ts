import SlOption from '@shoelace-style/shoelace/dist/components/option/option.component.js';

export class DsOption extends SlOption {
  createRenderRoot() { return this; }
}
if (!customElements.get('ds-option')) {
  customElements.define('ds-option', DsOption);
}
