import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl mb-4">⚠</div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', fontSize: '1.2rem', marginBottom: 8 }}>
            Something crashed
          </h2>
          <p style={{ color: '#6677aa', fontSize: '0.85rem', maxWidth: 400, marginBottom: 24 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              fontFamily: 'Cinzel, serif',
              background: 'linear-gradient(135deg, #C9A84C, #9a7a30)',
              color: '#080c14',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 10,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
