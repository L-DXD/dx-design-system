import SlBadge from '@shoelace-style/shoelace/dist/components/badge/badge.component.js';

export class DsBadge extends SlBadge {
  createRenderRoot() { return this; }
}
if (!customElements.get('ds-badge')) {
  customElements.define('ds-badge', DsBadge);
}
