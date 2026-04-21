import { DxElement } from './base-element.js';

const dialogBaseClasses =
  'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ' +
  'grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg rounded-lg border ' +
  'backdrop:bg-black/50 backdrop:backdrop-blur-sm';

export class DsDialog extends DxElement {
  protected getBaseClasses(): string {
    return dialogBaseClasses;
  }

  protected renderInternal(): HTMLElement {
    const dialog = document.createElement('dialog');

    // Alpine.js x-show 통합: host 의 style.display / hidden 를 관찰해 showModal/close 동기화
    const observer = new MutationObserver(() => {
      const hidden = this.style.display === 'none' || this.hasAttribute('hidden');
      if (!hidden && !dialog.open) dialog.showModal();
      else if (hidden && dialog.open) dialog.close();
    });
    observer.observe(this, { attributes: true, attributeFilter: ['style', 'hidden'] });

    dialog.addEventListener('close', () => {
      this.dispatchEvent(
        new CustomEvent('dialog-close', { bubbles: true, composed: true }),
      );
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    return dialog;
  }
}
