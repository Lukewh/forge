import { Component, type ComponentChildren } from "preact";

type ErrorBoundaryProps = {
  children: ComponentChildren;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("[Forge v3] Component error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div class="forge-v3-error-boundary">
          <div class="forge-v3-error-boundary-content">
            <h2>Dashboard error</h2>
            <p>Something went wrong rendering this section.</p>
            <pre>{this.state.error.message}</pre>
            <button
              type="button"
              class="forge-v3-da forge-v3-da-primary"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
