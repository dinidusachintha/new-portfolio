/// <reference types="vite/client" />

declare module "gsap/ScrollTrigger" {
  export class ScrollTrigger {
    static update(): void;
    static refresh(): void;
    static getAll(): any[];
    [key: string]: any;
  }
  export default ScrollTrigger;
}
