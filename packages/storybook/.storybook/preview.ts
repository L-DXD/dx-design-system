import '@dx/styles';
import type { Preview } from '@storybook/react-vite';
import axeKoLocale from 'axe-core/locales/ko.json';

const preview: Preview = {
  parameters: {
    a11y: { config: { locale: axeKoLocale } },
    options: {
      storySort: {
        order: ['Introduction', 'Foundation', 'Components'],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return story();
    },
  ],
};

export default preview;
