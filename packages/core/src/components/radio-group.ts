import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { defineElement } from '../utils/define-element.js';

export class DsRadioGroup extends SlRadioGroup {
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
defineElement("ds-radio-group", DsRadioGroup);
