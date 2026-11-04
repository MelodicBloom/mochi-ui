import React from 'react';
import { ClayCard } from './ClayCard';
import { ClayAvatar } from './ClayAvatar';
import { ClayButton } from './ClayButton';
import '../../styles/clay-composites.css';

export interface ClayProfileCardProps {
  name: string;
  role?: string;
  src?: string;
  stats?: { label: string; value: string }[];
  onFollow?: () => void;
}

/** Composite of existing ClayCard + ClayAvatar + ClayButton (no new primitive). */
export const ClayProfileCard: React.FC<ClayProfileCardProps> = ({ name, role, src, stats = [], onFollow }) => (
  <ClayCard colorway="lavender">
    <div className="clay-profile">
      <ClayAvatar src={src} alt={name} fallback={name.slice(0, 1)} size="lg" />
      <h3>{name}</h3>
      {role && <p className="clay-profile__role">{role}</p>}
      {stats.length > 0 && (
        <dl className="clay-profile__stats">
          {stats.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
        </dl>
      )}
      {onFollow && <ClayButton size="sm" onClick={onFollow}>Follow</ClayButton>}
    </div>
  </ClayCard>
);

export default ClayProfileCard;
