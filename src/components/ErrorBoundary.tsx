import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "#/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#080808] text-[#f5f4f0] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0f111a] border border-white/10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-violet-400 tracking-wider uppercase font-semibold">
                SYSTEM RECOVERY INTERFACE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-unbounded text-white">
                Something encountered a hiccup
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                An isolated interface component failed to render. The remainder of the application state is intact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/15"
              >
                <Home size={14} />
                <span>Return Home</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-violet-600/30"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
