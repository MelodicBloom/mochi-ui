import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import '../../styles/clay-composites.css';

export interface ClayCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender';
}

const fill = {
  mint: 'linear-gradient(160deg, #C9F5DC, var(--mochi-mint-soft, #8FE0B8))',
  blue: 'linear-gradient(160deg, var(--mochi-powder-blue, #BAE6FD), var(--mochi-baby-blue, #7DD3FC))',
  pink: 'linear-gradient(160deg, #FFE1E6, var(--mochi-blush-pink, #FDA4AF))',
  lavender: 'linear-gradient(160deg, #EBDDFE, var(--mochi-lavender, #C084FC))',
};

/** Inset clay well with a raised gradient check pill (ref styleguide chips). Native input for a11y. */
export const ClayCheckbox: React.FC<ClayCheckboxProps> = ({ checked, defaultChecked, indeterminate, onChange, label, disabled, colorway = 'mint' }) => {
  const id = useId();
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const reduce = useReducedMotion();
  const shown = on || !!indeterminate;
  return (
    <label htmlFor={id} className="clay-check" data-disabled={disabled || undefined}>
      <input id={id} type="checkbox" className="clay-check__native" checked={on} disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : on}
        onChange={e => { setInner(e.target.checked); onChange?.(e.target.checked); }} />
      <span className="clay-check__well" aria-hidden>
        <motion.span className="clay-check__pill" style={{ background: fill[colorway] }}
          initial={false} animate={{ scale: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.45, duration: 0.3 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            {indeterminate ? <path d="M6 12h12" /> : <path d="m5 12 5 5 9-10" />}
          </svg>
        </motion.span>
      </span>
      {label && <span className="clay-check__label">{label}</span>}
    </label>
  );
};

export default ClayCheckbox;
