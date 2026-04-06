"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertBanner } from "@/components/ui";

type Props = { children: ReactNode; label: string };

type State = { error: Error | null };

/**
 * Catches render/runtime errors inside a viewer adapter so one engine cannot blank the whole app.
 */
export class ViewerViewportErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ViewerViewport:${this.props.label}]`, error.message, error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-[200px] flex-col justify-center p-4">
          <AlertBanner
            tone="error"
            title={`${this.props.label} hit an error`}
            message={this.state.error.message || "Unknown error — check the console for details."}
            className="text-sm"
          />
          <p className="mt-2 text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Try switching scene mode or use Refresh. If this persists, the model or layer data may be invalid.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
