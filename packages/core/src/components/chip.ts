import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { defineElement } from '../utils/define-element.js';

export class DsChip extends SlTag {
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-remove': 'ds-remove' });
  }
}
defineElement("ds-chip", DsChip);
