import type { Meta, StoryObj } from '@storybook/react';
import { ClayToggle } from '../components/clay/ClayToggle';
import { ClayBadge } from '../components/clay/ClayBadge';
import { ClayProgress } from '../components/clay/ClayProgress';

const meta: Meta = { title: 'Clay/Surfaces' };
export default meta;

export const Surface: StoryObj = {
  render: () => (
    <div className="clay-surface" style={{ padding: 32, width: 360, display: 'grid', gap: 16 }}>
      <strong>.clay-surface</strong>
      <span>4-layer shadow matrix from <code>clay.css</code> tokens.</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <ClayBadge colorway="mint">mint</ClayBadge>
        <ClayBadge colorway="lavender">lavender</ClayBadge>
        <ClayBadge colorway="peach">peach</ClayBadge>
      </div>
    </div>
  ),
};

export const Toggle: StoryObj<typeof ClayToggle> = {
  render: (args) => <ClayToggle {...args} />,
  args: { label: 'Tactile toggle', colorway: 'mint', size: 'md' },
};

export const Progress: StoryObj = {
  render: () => <div style={{ width: 320 }}><ClayProgress value={64} /></div>,
};
