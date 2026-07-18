import { Component, type ErrorInfo, type ReactNode } from "react";

type AppRuntimeErrorBoundaryProps = {
  children: ReactNode;
};

type AppRuntimeErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class AppRuntimeErrorBoundary extends Component<
  AppRuntimeErrorBoundaryProps,
  AppRuntimeErrorBoundaryState
> {
  public state: AppRuntimeErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(
    error: Error,
  ): AppRuntimeErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "Unknown React runtime error.",
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RankVelt application runtime error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-16 text-white">
          <section className="w-full max-w-3xl rounded-3xl border border-red-400/30 bg-red-400/[0.06] p-6 sm:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
              RankVelt Development Error
            </p>

            <h1 className="mt-4 text-3xl font-black text-white">
              The page could not render.
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/65">
              This is a development-only diagnostic screen. Copy or screenshot
              the exact error below.
            </p>

            <pre className="mt-6 overflow-x-auto rounded-2xl border border-red-400/20 bg-black/40 p-5 text-left text-sm leading-relaxed text-red-200 whitespace-pre-wrap">
              {this.state.errorMessage}
            </pre>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#f9a825] px-5 py-3 text-xs font-black text-black"
            >
              Reload Page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppRuntimeErrorBoundary;