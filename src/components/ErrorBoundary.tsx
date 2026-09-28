import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// @ts-ignore
export class ErrorBoundary extends Component<Props, State> {
  // @ts-ignore
  constructor(props: Props) {
    // @ts-ignore
    super(props);
    // @ts-ignore
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('alfeena_cart');
      localStorage.removeItem('alfeena_local_orders');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    // @ts-ignore
    if (this.state && this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-bengali">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#853609] flex items-center justify-center mx-auto text-2xl font-bold">
              👗
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              আলফিনা এক্সক্লুসিভ থ্রি পিস
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              স্টোরফ্রন্ট লোড হতে একটি সাময়িক ত্রুটি হয়েছে। নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
            </p>
            {/* @ts-ignore */}
            {this.state.error && (
              <pre className="text-[11px] text-left p-3 bg-stone-100 rounded-xl overflow-x-auto text-stone-600 font-mono">
                {/* @ts-ignore */}
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-[#853609] hover:bg-[#6e2b07] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              পুনরায় লোড করুন (Reload Page)
            </button>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

