import { DsButton } from './ds-button.js';
import { DsInput } from './ds-input.js';
import { DsLabel } from './ds-label.js';
import { DsBadge } from './ds-badge.js';
import { DsHelperText } from './ds-helper-text.js';
import { DsErrorMessage } from './ds-error-message.js';
import { DsDialog } from './ds-dialog.js';

const define = (name: string, ctor: CustomElementConstructor) => {
  if (!customElements.get(name)) customElements.define(name, ctor);
};

const register = () => {
  define('ds-button', DsButton);
  define('ds-input', DsInput);
  define('ds-label', DsLabel);
  define('ds-badge', DsBadge);
  define('ds-helper-text', DsHelperText);
  define('ds-error-message', DsErrorMessage);
  define('ds-dialog', DsDialog);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', register, { once: true });
} else {
  register();
}

export {
  DsButton,
  DsInput,
  DsLabel,
  DsBadge,
  DsHelperText,
  DsErrorMessage,
  DsDialog,
};
