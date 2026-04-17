import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio.component.js';

export class DsRadio extends SlRadio {
  createRenderRoot() { return this; }
}
if (!customElements.get('ds-radio')) {
  customElements.define('ds-radio', DsRadio);
}
