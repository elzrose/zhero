import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = 'dashboard';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            maxWidth: '680px',
            margin: '3rem auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(219, 94, 140, 0.08)',
            textAlign: 'center',
            fontFamily: 'var(--font-family-admin, sans-serif)',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#FCEADE',
              color: '#DB5E8C',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid #FAD1C6',
            }}
          >
            <AlertCircle size={28} />
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
            Application View Encountered an Error
          </h2>

          <p style={{ fontSize: '0.85rem', color: '#77736D', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            The current administrative view encountered an unexpected issue while rendering data.
            Your session is safe and uncorrupted.
          </p>

          {this.state.error && (
            <div
              style={{
                backgroundColor: '#FCEADE',
                border: '1px solid #FAD1C6',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#DB5E8C',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
              }}
            >
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#DB5E8C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={15} />
              Reset & Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
