// Minimal TypeScript declarations for dom-to-image-more.
// Adjust or extend as needed if you use more advanced options.

declare module 'dom-to-image-more' {
  export interface DomToImageOptions {
    filter?: (node: HTMLElement) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, any>;
    quality?: number; // for JPEG
    imagePlaceholder?: string;
    cacheBust?: boolean;
    pixelRatio?: number;
  }

  export function toSvg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob>;
  export function toPixelData(node: HTMLElement, options?: DomToImageOptions): Promise<Uint8Array>;
  export function toCanvas(node: HTMLElement, options?: DomToImageOptions): Promise<HTMLCanvasElement>;

  const domToImageMore: {
    toSvg: typeof toSvg;
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toBlob: typeof toBlob;
    toPixelData: typeof toPixelData;
    toCanvas: typeof toCanvas;
  };

  export default domToImageMore;
}
