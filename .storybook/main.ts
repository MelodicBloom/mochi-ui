import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Relative base so the static build works under any sub-path,
  // e.g. https://melodicbloom.github.io/mochi-ui/storybook/
  viteFinal: async (cfg) => ({ ...cfg, base: './' }),
  docs: { autodocs: 'tag' },
};
export default config;
