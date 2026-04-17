import SlOption from '@shoelace-style/shoelace/dist/components/option/option.component.js';

export class DsOption extends SlOption {}
if (!customElements.get('ds-option')) {
  customElements.define('ds-option', DsOption);
}
