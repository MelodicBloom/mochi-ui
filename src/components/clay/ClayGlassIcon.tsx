import React from 'react';
import '../../styles/clay-composites.css';

export interface ClayGlassIconProps { icon: React.ReactNode; label: string; href?: string; }

/**
 * Frosted icon tile + caps label. CSS approximation (backdrop blur, rim, inner/outer
 * shadow) with opaque fallback. Does NOT reproduce refraction or caustics.
 */
export const ClayGlassIcon: React.FC<ClayGlassIconProps> = ({ icon, label, href }) => {
  const content = (<><i className="clay-glass" aria-hidden="true">{icon}</i>{label.toUpperCase()}</>);
  return href
    ? <a className="clay-glass-icon" href={href} aria-label={label}>{content}</a>
    : <span className="clay-glass-icon" role="img" aria-label={label}>{content}</span>;
};

export default ClayGlassIcon;
