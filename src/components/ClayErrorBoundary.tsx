/**
 * MOCHI UI — ClayErrorBoundary v2.0
 *
 * Previously lived as ErrorBoundary.tsx with no export from either
 * barrel file, making it invisible to consumers. Renamed to
 * ClayErrorBoundary for naming consistency, upgraded fallback UI
 * to use design tokens, and added an `onError` callback prop.
 */

import React, { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

export interface ClayErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Receives the caught error. */
  fallback?: ReactNode | ((error: Error) => ReactNode);
  /** Called with the error and component stack on catch. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ClayErrorBoundary extends Component<ClayErrorBoundaryProps, State> {
  constructor(props: ClayErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ClayErrorBoundary]', error, errorInfo);
    }
  }

  render() {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      if (fallback) {
        return typeof fallback === 'function' ? fallback(error) : fallback;
      }
      return (
        <div
          style={{
            padding: 'var(--mochi-space-12)',
            textAlign: 'center',
            background: 'var(--mochi-surface)',
            borderRadius: 'var(--mochi-radius-xl)',
            boxShadow: 'var(--mochi-clay-rest)',
            color: 'var(--mochi-text-secondary)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 'var(--mochi-space-4)' }}>💥</div>
          <p style={{ fontFamily: 'var(--mochi-font-body)', fontSize: 'var(--mochi-text-sm)', margin: 0 }}>
            Something went wrong loading this component.
          </p>
          {process.env.NODE_ENV !== 'production' && (
            <details style={{ marginTop: 'var(--mochi-space-4)', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: 'var(--mochi-text-xs)', color: 'var(--mochi-text-tertiary)' }}>
                Error details
              </summary>
              <pre style={{ fontSize: 'var(--mochi-text-xs)', color: 'var(--mochi-error-600)', marginTop: 'var(--mochi-space-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ClayErrorBoundary;
