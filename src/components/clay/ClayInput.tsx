import React, { useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

const ClayInputBase: React.FC<ClayInputProps> = ({
  type = 'text',
  placeholder,
  value: controlledValue,
  onChange,
  icon,
  label,
  error,
  disabled = false,
  autoFocus = false,
  style,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Spring for focus animation
  const scale = useSpring(1, { stiffness: 400, damping: 25 });
  const glowOpacity = useSpring(0, { stiffness: 300, damping: 20 });

  const handleFocus = () => {
    setIsFocused(true);
    scale.set(1.02);
    glowOpacity.set(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    scale.set(1);
    glowOpacity.set(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div style={{ width: '100%', ...style }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontSize: 14, 
          fontWeight: 500,
          color: error ? '#FB7185' : 'var(--text-primary)',
        }}>
          {label}
        </label>
      )}

      <motion.div
        style={{
          position: 'relative',
          scale,
        }}
      >
        {/* Glow effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: 19,
            background: 'var(--mochi-mint)',
            opacity: glowOpacity,
            filter: 'blur(8px)',
            zIndex: -1,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderRadius: 16,
            background: 'var(--bg-surface)',
            boxShadow: isFocused
              ? 'inset 6px 6px 12px rgba(0,0,0,0.08), inset -6px -6px 12px rgba(255,255,255,0.9), 0 0 0 2px var(--mochi-mint)'
              : 'inset 4px 4px 8px rgba(0,0,0,0.05), inset -4px -4px 8px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.02)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          {icon && (
            <span style={{ 
              color: isFocused ? 'var(--mochi-mint)' : 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              flexShrink: 0,
            }}>
              {icon}
            </span>
          )}

          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'var(--font-family)',
              fontSize: 16,
              color: 'var(--text-primary)',
              caretColor: 'var(--mochi-mint)',
            }}
          />
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            marginTop: 6, 
            fontSize: 12, 
            color: '#FB7185',
            fontWeight: 500,
          }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const ClayInput = withClayReducedMotion(ClayInputBase, 'ClayInput');

export default ClayInput;
