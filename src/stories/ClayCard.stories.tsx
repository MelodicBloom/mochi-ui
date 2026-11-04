import type { Meta, StoryObj } from '@storybook/react';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayBadge } from '../components/clay/ClayBadge';

const meta: Meta<typeof ClayCard> = {
  title: 'Clay/Card',
  component: ClayCard,
  tags: ['autodocs'],
  args: { colorway: 'ivory', variant: 'default', interactive: true },
  argTypes: {
    colorway: { control: 'select', options: ['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral', 'ivory'] },
    variant: { control: 'select', options: ['default', 'bento', 'stats', 'notification'] },
  },
  render: (args) => (
    <ClayCard {...args} style={{ padding: 28, width: 320, borderRadius: 32, position: 'relative' }}
      header={<ClayBadge colorway="pink">new</ClayBadge>}>
      <h3 style={{ margin: '12px 0 6px' }}>Mochi card</h3>
      <p style={{ margin: 0, opacity: 0.75 }}>Hover to tilt — spring-driven 3D clay surface.</p>
    </ClayCard>
  ),
};
export default meta;
export const Default: StoryObj<typeof ClayCard> = {};
export const Mint: StoryObj<typeof ClayCard> = { args: { colorway: 'mint' } };
