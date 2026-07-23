import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#031B2E] text-white">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <AlertOctagon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading">Something went wrong</h2>
          <p className="text-sm text-[#A8C7D8] max-w-md mt-2 mb-6">
            An unforeseen rendering exception occurred. Please reload the page to restore your ocean session.
          </p>
          <Button
            variant="gradient"
            size="md"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Reload FloatChat
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
