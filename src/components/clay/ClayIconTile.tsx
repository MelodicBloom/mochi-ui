import React from 'react';
import '../../styles/clay-composites.css';

export interface ClayIconTileProps { icon: React.ReactNode; label: string; tone?: string; }

/** Raised clay squircle with a glyph (ref icon set). Presentational. */
export const ClayIconTile: React.FC<ClayIconTileProps> = ({ icon, label, tone = 'var(--mochi-baby-blue, #7DD3FC)' }) => (
  <span className="clay-icon-tile" role="img" aria-label={label} style={{ ['--tile-tone' as string]: tone } as React.CSSProperties}>{icon}</span>
);

export default ClayIconTile;
