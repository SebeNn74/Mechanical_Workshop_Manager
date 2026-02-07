/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import * as React from 'react';
  export const ReactComponent: React.VFC<React.SVGProps<SVGSVGElement>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const src: string;
  export default ReactComponent;
}
