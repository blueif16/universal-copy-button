import { ReactNode, CSSProperties } from 'react';

export interface CopyButtonProps {
  variant?: 'glass' | 'tech' | 'minimal' | 'floating';
  iconOnly?: boolean;
  format?: 'text' | 'markdown' | 'html';
  separator?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onCopy?: (text: string) => void;
  onCopyError?: (error: Error) => void;
}

export interface CopyProviderProps {
  children: ReactNode;
  defaultFormat?: 'text' | 'markdown' | 'html';
  defaultSeparator?: string;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
} 