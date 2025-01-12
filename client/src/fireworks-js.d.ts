// fireworks-js.d.ts
declare module 'fireworks-js' {
    interface Options {
      trace?: number;
      explosion?: number;
      particles?: number;
      opacity?: number;
      acceleration?: number;
      brightness?: number;
      decay?: number;
    }
  
    export default class Fireworks {
      constructor(container: HTMLElement, options: Options);
      start(): void;
      stop(): void;
    }
  }
  