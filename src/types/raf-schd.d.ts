declare module 'raf-schd' {
  interface Schedule<T extends (...args: any[]) => void> {
    (...args: Parameters<T>): void;
    cancel(): void;
  }

  declare function rafSchd<T extends (...args: any[]) => void>(
    fn: T,
  ): Schedule<T>;

  export = rafSchd;
}
