import type { Meta, StoryObj } from '@storybook/react';
import { ClayButton } from '../components/clay/ClayButton';

const meta: Meta<typeof ClayButton> = {
  title: 'Clay/Button',
  component: ClayButton,
  tags: ['autodocs'],
  args: { children: 'Squish me', colorway: 'mint', size: 'md', bounce: 0.4, duration: 300 },
  argTypes: {
    colorway: { control: 'select', options: ['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    bounce: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    duration: { control: { type: 'range', min: 100, max: 1000, step: 10 } },
  },
};
export default meta;
type Story = StoryObj<typeof ClayButton>;

export const Primary: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Colorways: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'] as const).map((c) => (
        <ClayButton key={c} {...args} colorway={c}>{c}</ClayButton>
      ))}
    </div>
  ),
};
