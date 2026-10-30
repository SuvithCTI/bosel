import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('B★SEL Application Crash caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <span className="text-4xl block">⚠️</span>
            <h1 className="text-xl font-black text-white">Something went wrong</h1>
            <p className="text-xs text-slate-300">
              The application encountered an unexpected display issue.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 bg-slate-950 text-red-400 rounded-xl text-[11px] text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('bsel_courses_data');
                    localStorage.removeItem('bsel_partner_schools');
                  } catch {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Reset Stored Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
