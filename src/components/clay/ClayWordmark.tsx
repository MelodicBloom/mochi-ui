import React from 'react';
import '../../styles/clay-composites.css';

/** Gradient display wordmark with soft drop-shadow volume. Not a glass/jelly render. */
export const ClayWordmark: React.FC<{ children: React.ReactNode; as?: 'h1' | 'span' }> = ({ children, as: Tag = 'span' }) => (
  <Tag className="clay-wordmark">{children}</Tag>
);

export default ClayWordmark;
