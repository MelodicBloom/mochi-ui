import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ClayRebound } from '../components/animations/ClayRebound';
import { ClayButton } from '../components/clay/ClayButton';

const meta: Meta = { title: 'Motion/Clay Rebound' };
export default meta;

export const Rebound: StoryObj = {
  render: () => {
    const [t, setT] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 24, placeItems: 'center' }}>
        <ClayRebound trigger={t} onComplete={() => setT(false)}>
          <div className="clay-surface" style={{ width: 140, height: 140, display: 'grid', placeItems: 'center' }}>mochi</div>
        </ClayRebound>
        <ClayButton colorway="lavender" onClick={() => setT(true)}>Rebound</ClayButton>
      </div>
    );
  },
};
