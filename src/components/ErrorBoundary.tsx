import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleCopyError = () => {
    const errorText = `Error: ${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-lg">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                It's not you, it's us
              </h1>
              <p className="text-gray-500">
                We messed up. Something went wrong while loading this page.
              </p>
            </div>

            <div className="rounded-md bg-gray-100 p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Developer Note
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  onClick={this.handleCopyError}
                  title="Copy error details"
                >
                  {this.state.copied ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
              </div>
              <code className="block max-h-32 overflow-auto text-xs text-red-600 break-words font-mono">
                {this.state.error?.toString()}
              </code>
            </div>

            <Button className="w-full" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
