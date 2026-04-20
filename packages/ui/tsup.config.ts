import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'styles/button': 'src/components/ui/button.styles.ts',
    'styles/badge': 'src/components/ui/badge.styles.ts',
    'styles/input': 'src/components/ui/input.styles.ts',
    'styles/label': 'src/components/ui/label.styles.ts',
    'styles/form-field': 'src/components/ui/form-field.styles.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
});
