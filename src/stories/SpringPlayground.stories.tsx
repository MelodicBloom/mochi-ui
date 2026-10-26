import type { Meta, StoryObj } from '@storybook/react';
import { SpringPlayground } from '../components/playground/SpringPlayground';

const meta: Meta<typeof SpringPlayground> = {
  title: 'Motion/Spring Playground',
  component: SpringPlayground,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { initialStiffness: 240, initialDamping: 22, initialMass: 1.1 },
};
export default meta;
type Story = StoryObj<typeof SpringPlayground>;

export const Clay: Story = {};
export const Bouncy: Story = { args: { initialStiffness: 350, initialDamping: 8, initialMass: 1.2 } };
export const Overdamped: Story = { args: { initialStiffness: 200, initialDamping: 60, initialMass: 1 } };
export const ReducedMotion: Story = { args: { reducedMotion: true } };
