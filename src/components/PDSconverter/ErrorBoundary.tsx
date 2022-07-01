import React, { Component, ErrorInfo, ReactNode } from 'react';

const changedArray = (a: Array<unknown> = [], b: Array<unknown> = []) =>
  a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));

interface Props {
  onReset?: (...args: Array<unknown>) => void;
  onResetKeysChange?: (
    prevResetKeys: Array<unknown> | undefined,
    resetKeys: Array<unknown> | undefined
    ) => void;
  fallbackView: ReactNode;
  children?: ReactNode;
  resetKeys?: Array<unknown>;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  resetErrorBoundary = (...args: Array<unknown>) => {
    this.props.onReset?.(...args);
    this.reset();
  };

  reset() {
    this.setState({
      hasError: false,
    });
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { hasError } = this.state;
    const { resetKeys } = this.props;

    // There's an edge case where if the thing that triggered the error
    // happens to *also* be in the resetKeys array, we'd end up resetting
    // the error boundary immediately. This would likely trigger a second
    // error to be thrown.
    // So we make sure that we don't check the resetKeys on the first call
    // of cDU after the error is set

    if (
      hasError !== null &&
      prevState.hasError !== null &&
      changedArray(prevProps.resetKeys, resetKeys)
    ) {
      this.props.onResetKeysChange?.(prevProps.resetKeys, resetKeys);
      this.reset();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <h1>
          에러가났네요! 정상적인 컴포넌트를 작성하시구 다시 아래 버튼을 눌러주세요!
          <button onClick={this.resetErrorBoundary}>다시 그리기!</button>
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
