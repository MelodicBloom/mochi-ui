import type { Preview } from '@storybook/react';
import '../src/styles/clay.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'clay',
      values: [
        { name: 'clay', value: '#f4efe9' },
        { name: 'night', value: '#1f1b24' },
      ],
    },
    controls: { expanded: true },
  },
};
export default preview;
