import React, { useState, useCallback, useEffect, useContext, createContext, useRef } from 'react';
import { Copy, Check, X } from 'lucide-react';
import type { CopyButtonProps, CopyProviderProps } from './types';

// Universal Copy Standard - FIXED, not configurable
const UNIVERSAL_COPY_SELECTOR = '[copy]';
const UNIVERSAL_EXCLUDE_ATTRIBUTE = 'no-copy';

// Context for app-wide configuration (optional)
const CopyContext = createContext({
  defaultFormat: 'text',
  defaultSeparator: '\n\n',
  onCopySuccess: () => {},
  onCopyError: () => {}
});

export const CopyProvider: React.FC<CopyProviderProps> = ({ children, ...config }) => (
  <CopyContext.Provider value={config}>
    {children}
  </CopyContext.Provider>
);

// Utility functions
const isElementVisible = (el: Element): boolean => {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         (el as HTMLElement).offsetParent !== null;
};

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get text content excluding no-copy elements
const getTextContent = (element: Element): string => {
  // If element itself has no-copy, return empty
  if (element.hasAttribute(UNIVERSAL_EXCLUDE_ATTRIBUTE)) {
    return '';
  }
  
  // If element has no children, return its text
  if (element.children.length === 0) {
    return element.textContent?.trim() || '';
  }
  
  // Process children
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!(node as Element).hasAttribute(UNIVERSAL_EXCLUDE_ATTRIBUTE)) {
        text += getTextContent(node as Element);
      }
    }
  }
  
  return text.trim();
};

// Custom hook for watching copyable content
const useCopyableContent = (options: { includeHidden?: boolean; debounceMs?: number } = {}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const { includeHidden = false, debounceMs = 100 } = options;

  useEffect(() => {
    const updateElements = () => {
      try {
        // Only get elements explicitly marked with copy
        const allElements = document.querySelectorAll(UNIVERSAL_COPY_SELECTOR);
        let filtered = Array.from(allElements);

        if (!includeHidden) {
          filtered = filtered.filter(isElementVisible);
        }

        setElements(filtered);
      } catch (err) {
        console.error('Error finding copyable elements:', err);
        setElements([]);
      }
    };

    // Initial update
    updateElements();

    // Watch for changes
    const debouncedUpdate = debounce(updateElements, debounceMs);
    const observer = new MutationObserver(debouncedUpdate);
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['copy', UNIVERSAL_EXCLUDE_ATTRIBUTE]
    });

    return () => observer.disconnect();
  }, [includeHidden, debounceMs]);

  return elements;
};

// Copy to clipboard with fallback
const copyToClipboard = async (text: string, fallbackEnabled = true): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      if (!fallbackEnabled) throw err;
    }
  }

  if (fallbackEnabled) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) throw new Error('Copy command failed');
      return true;
    } catch (err) {
      throw err;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  throw new Error('Copy failed and fallback is disabled');
};

// Get dominant color from surrounding elements
const useAdaptiveColor = (buttonRef: React.RefObject<HTMLButtonElement>) => {
  const [dominantColor, setDominantColor] = useState<'light' | 'dark' | null>(null);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const findParentWithBackground = (element: HTMLElement): string | null => {
      let parent = element.parentElement;
      while (parent) {
        const bg = window.getComputedStyle(parent).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return bg;
        }
        parent = parent.parentElement;
      }
      return null;
    };
    
    const bg = findParentWithBackground(buttonRef.current);
    if (bg) {
      // Simple color parsing - in production, use a proper color library
      const rgb = bg.match(/\d+/g);
      if (rgb) {
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        setDominantColor(brightness > 128 ? 'light' : 'dark');
      }
    }
  }, []);
  
  return dominantColor;
};

// Universal Copy Button with Elegant Design
export const CopyButton: React.FC<CopyButtonProps> = ({
  format = 'text',
  separator,
  className = '',
  style = {},
  iconOnly = false,
  variant = 'glass',
  children,
  onCopy,
  onCopyError,
  ...buttonProps
}) => {
  const context = useContext(CopyContext);
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundTheme = useAdaptiveColor(buttonRef);

  const finalFormat = format || context.defaultFormat || 'text';
  const finalSeparator = separator !== undefined ? separator : (context.defaultSeparator || '\n\n');
  const finalOnCopy = onCopy || context.onCopySuccess;
  const finalOnError = onCopyError || context.onCopyError;

  const elements = useCopyableContent({ includeHidden: false, debounceMs: 100 });

  // Process elements for copying
  const processElements = useCallback((elementsToProcess: Element[]) => {
    const processed = [...elementsToProcess].sort((a, b) => {
      const orderA = parseInt(a.getAttribute('copy') || '999999');
      const orderB = parseInt(b.getAttribute('copy') || '999999');
      if (!isNaN(orderA) && !isNaN(orderB)) {
        return orderA - orderB;
      }
      return 0;
    });
    return processed;
  }, []);

  // Convert elements to desired format
  const convertToFormat = useCallback((processedElements: Element[]) => {
    switch (finalFormat) {
      case 'html':
        return processedElements.map(el => {
          const clone = el.cloneNode(true) as Element;
          clone.querySelectorAll(`[${UNIVERSAL_EXCLUDE_ATTRIBUTE}]`).forEach(excluded => {
            excluded.remove();
          });
          return (clone as HTMLElement).outerHTML;
        }).join(finalSeparator);
      
      case 'markdown':
        return processedElements.map(el => {
          const text = getTextContent(el);
          const tagName = el.tagName.toLowerCase();
          
          if (tagName === 'h1') return `# ${text}`;
          if (tagName === 'h2') return `## ${text}`;
          if (tagName === 'h3') return `### ${text}`;
          if (tagName === 'h4') return `#### ${text}`;
          if (tagName === 'h5') return `##### ${text}`;
          if (tagName === 'h6') return `###### ${text}`;
          if (tagName === 'li') return `- ${text}`;
          if (tagName === 'blockquote') return `> ${text}`;
          
          return text;
        }).join(finalSeparator);
      
      case 'text':
      default:
        return processedElements.map(el => getTextContent(el)).join(finalSeparator);
    }
  }, [finalFormat, finalSeparator]);

  const handleCopy = useCallback(async () => {
    if (elements.length === 0) {
      const error = new Error('No content marked with "copy" attribute found');
      setErrorMessage('No content to copy');
      setCopyState('error');
      if (finalOnError) finalOnError(error);
      setTimeout(() => {
        setCopyState('idle');
        setErrorMessage('');
      }, 2500);
      return;
    }

    try {
      setCopyState('copying');
      
      const processedElements = processElements(elements);
      const content = convertToFormat(processedElements);
      
      await copyToClipboard(content, true);
      
      setCopyState('success');
      if (finalOnCopy) finalOnCopy(content);
      
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      setErrorMessage('Failed to copy');
      setCopyState('error');
      if (finalOnError) finalOnError(err as Error);
      
      setTimeout(() => {
        setCopyState('idle');
        setErrorMessage('');
      }, 2500);
    }
  }, [
    elements,
    processElements,
    convertToFormat,
    finalOnCopy,
    finalOnError
  ]);

  // Elegant glass morphism styles
  const getVariantStyles = () => {
    const baseStyles = `
      relative inline-flex items-center justify-center
      font-medium tracking-wide
      transition-all duration-300 ease-out
      disabled:cursor-not-allowed disabled:opacity-50
      select-none cursor-pointer
      overflow-hidden
    `;
    
    const glassBase = backgroundTheme === 'dark' 
      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
      : 'bg-black/5 hover:bg-black/10 text-gray-900 border-gray-900/10';
    
    switch (variant) {
      case 'glass':
        return `${baseStyles} 
          ${iconOnly ? 'p-2.5' : 'px-5 py-2.5'} 
          rounded-xl
          ${glassBase}
          backdrop-blur-md backdrop-saturate-150
          border
          shadow-lg hover:shadow-xl
          before:absolute before:inset-0 
          before:bg-gradient-to-tr before:from-white/0 before:via-white/5 before:to-white/0
          before:translate-y-full hover:before:translate-y-0
          before:transition-transform before:duration-500
          ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
        `;
      
      case 'minimal':
        return `${baseStyles} 
          ${iconOnly ? 'p-2' : 'px-4 py-2'} 
          rounded-lg
          ${backgroundTheme === 'dark' 
            ? 'text-gray-300 hover:text-white hover:bg-white/10' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}
        `;
      
      case 'floating':
        return `${baseStyles} 
          fixed bottom-6 right-6 z-50
          ${iconOnly ? 'p-4' : 'px-6 py-3'}
          rounded-2xl
          ${glassBase}
          backdrop-blur-xl backdrop-saturate-200
          border
          shadow-2xl hover:shadow-3xl
          before:absolute before:inset-0
          before:bg-gradient-to-t before:from-white/0 before:to-white/10
          before:opacity-0 hover:before:opacity-100
          before:transition-opacity before:duration-300
          after:absolute after:inset-0 after:-z-10
          after:bg-gradient-to-br after:from-blue-500/20 after:to-purple-500/20
          after:blur-xl after:opacity-0 hover:after:opacity-100
          after:transition-opacity after:duration-500
          ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
        `;
        
      case 'tech':
        return `${baseStyles}
          ${iconOnly ? 'p-2.5' : 'px-6 py-2.5'}
          rounded-lg
          bg-gradient-to-r from-cyan-500/10 to-blue-500/10
          hover:from-cyan-500/20 hover:to-blue-500/20
          ${backgroundTheme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}
          border border-cyan-500/20
          shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]
          backdrop-blur-sm
          ${isPressed ? 'scale-95' : ''}
        `;
        
      default:
        return `${baseStyles} px-4 py-2 rounded-lg`;
    }
  };

  // Dynamic state styles with smooth transitions
  const getStateStyles = () => {
    return copyState === 'success' 
      ? 'animate-pulse bg-gradient-to-r from-green-400/20 to-emerald-400/20' 
      : '';
  };

  // Enhanced icons with animation
  const icons = {
    idle: <Copy className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />,
    copying: (
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0.5 border-2 border-current/30 border-t-transparent rounded-full animate-spin" style={{animationDirection: 'reverse'}} />
      </div>
    ),
    success: <Check className="w-4 h-4" />,
    error: <X className="w-4 h-4" />
  };

  const labels = {
    idle: children || 'Copy',
    copying: 'Copying...',
    success: 'Copied!',
    error: errorMessage || 'Error!'
  };

  // Micro-interaction handlers
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleCopy}
      disabled={copyState !== 'idle'}
      className={`${getVariantStyles()} ${getStateStyles()} ${className} group`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Copy marked content"
      aria-live="polite"
      aria-busy={copyState === 'copying'}
      {...buttonProps}
    >
      {/* Ripple effect on click */}
      {copyState === 'copying' && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="absolute w-full h-full bg-current opacity-10 rounded-full animate-ping" />
        </span>
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center">
        {iconOnly ? (
          <span aria-label={labels[copyState]}>{icons[copyState]}</span>
        ) : (
          <>
            <span className="mr-2 transition-all duration-300">
              {icons[copyState]}
            </span>
            <span className="transition-all duration-300">
              {labels[copyState]}
            </span>
          </>
        )}
      </span>
      
      {/* Success shimmer effect */}
      {copyState === 'success' && (
        <span className="absolute inset-0 -z-10">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" style={{
            animation: 'shimmer 1s ease-out',
            transform: 'translateX(-100%) skewX(-12deg)'
          }} />
        </span>
      )}
    </button>
  );
};