import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#070b28] flex items-center justify-center p-6">
          <div className="glass-panel rounded-lg p-8 max-w-md w-full border border-error/30 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-3xl">error</span>
              <h2 className="font-headline font-bold text-xl text-white">Qualcosa è andato storto</h2>
            </div>
            <pre className="text-error text-xs bg-error/10 rounded-lg p-4 overflow-auto whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-full bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-on-primary-fixed font-bold"
            >
              Ricarica
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
