import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Universal Copy Standard attributes
    copy?: string | boolean;
    'no-copy'?: boolean;
  }
} 