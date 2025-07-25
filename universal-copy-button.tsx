import React, { useState, useCallback, useEffect, useContext, createContext, useMemo, useRef } from 'react';
import { Copy, Check, X, RefreshCw, Plus, Trash2, Edit, Save, Loader } from 'lucide-react';

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

export const CopyProvider = ({ children, ...config }) => (
  <CopyContext.Provider value={config}>
    {children}
  </CopyContext.Provider>
);

// Utility functions
const isElementVisible = (el) => {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         el.offsetParent !== null;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get text content excluding no-copy elements
const getTextContent = (element) => {
  // If element itself has no-copy, return empty
  if (element.hasAttribute(UNIVERSAL_EXCLUDE_ATTRIBUTE)) {
    return '';
  }
  
  // If element has no children, return its text
  if (element.children.length === 0) {
    return element.textContent.trim();
  }
  
  // Process children
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!node.hasAttribute(UNIVERSAL_EXCLUDE_ATTRIBUTE)) {
        text += getTextContent(node);
      }
    }
  }
  
  return text.trim();
};

// Custom hook for watching copyable content
const useCopyableContent = (options = {}) => {
  const [elements, setElements] = useState([]);
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
const copyToClipboard = async (text, fallbackEnabled = true) => {
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
const useAdaptiveColor = (buttonRef) => {
  const [dominantColor, setDominantColor] = useState(null);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const findParentWithBackground = (element) => {
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
export const CopyButton = ({
  format = 'text',
  separator,
  includeHidden = false,
  debounceMs = 100,
  fallbackEnabled = true,
  onCopy,
  onError,
  children,
  className = '',
  style = {},
  showIcon = true,
  iconOnly = false,
  variant = 'glass', // Changed default to glass
  successDuration = 2000,
  errorDuration = 2500,
  adaptive = true,
  ...buttonProps
}) => {
  const context = useContext(CopyContext);
  const [copyState, setCopyState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef(null);
  const backgroundTheme = useAdaptiveColor(buttonRef);

  const finalFormat = format || context.defaultFormat || 'text';
  const finalSeparator = separator !== undefined ? separator : (context.defaultSeparator || '\n\n');
  const finalOnCopy = onCopy || context.onCopySuccess;
  const finalOnError = onError || context.onCopyError;

  const elements = useCopyableContent({ includeHidden, debounceMs });

  // Process elements for copying
  const processElements = useCallback((elementsToProcess) => {
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
  const convertToFormat = useCallback((processedElements) => {
    switch (finalFormat) {
      case 'html':
        return processedElements.map(el => {
          const clone = el.cloneNode(true);
          clone.querySelectorAll(`[${UNIVERSAL_EXCLUDE_ATTRIBUTE}]`).forEach(excluded => {
            excluded.remove();
          });
          return clone.outerHTML;
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
      }, errorDuration);
      return;
    }

    try {
      setCopyState('copying');
      
      const processedElements = processElements(elements);
      const content = convertToFormat(processedElements);
      
      await copyToClipboard(content, fallbackEnabled);
      
      setCopyState('success');
      if (finalOnCopy) finalOnCopy(content);
      
      setTimeout(() => setCopyState('idle'), successDuration);
    } catch (err) {
      console.error('Copy error:', err);
      setErrorMessage('Failed to copy');
      setCopyState('error');
      if (finalOnError) finalOnError(err);
      
      setTimeout(() => {
        setCopyState('idle');
        setErrorMessage('');
      }, errorDuration);
    }
  }, [
    elements,
    processElements,
    convertToFormat,
    fallbackEnabled,
    finalOnCopy,
    finalOnError,
    successDuration,
    errorDuration
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
    
    const glassBase = adaptive && backgroundTheme === 'dark' 
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
          ${adaptive && backgroundTheme === 'dark' 
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
          ${adaptive && backgroundTheme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}
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
    const pulseAnimation = copyState === 'success' 
      ? 'animate-pulse bg-gradient-to-r from-green-400/20 to-emerald-400/20' 
      : '';
    
    return pulseAnimation;
  };

  // Enhanced icons with animation
  const icons = {
    idle: <Copy className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />,
    copying: (
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0.5 border-2 border-current/30 border-t-transparent rounded-full animate-spin animate-reverse" />
      </div>
    ),
    success: <Check className="w-4 h-4 animate-in zoom-in-50 duration-300" />,
    error: <X className="w-4 h-4 animate-in zoom-in-50 duration-300" />
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
            {showIcon && (
              <span className="mr-2 transition-all duration-300">
                {icons[copyState]}
              </span>
            )}
            <span className="transition-all duration-300">
              {labels[copyState]}
            </span>
          </>
        )}
      </span>
      
      {/* Success shimmer effect */}
      {copyState === 'success' && (
        <span className="absolute inset-0 -z-10">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </span>
      )}
    </button>
  );
};

// Custom CSS for animations (add to your global styles)
const customStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(200%) skewX(-12deg); }
  }
  
  @keyframes animate-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  
  .animate-shimmer {
    animation: shimmer 1s ease-out;
  }
  
  .animate-reverse {
    animation: animate-reverse 1s linear infinite;
  }
`;

// ============================================
// COMPLEX DYNAMIC REACT APP DEMO
// ============================================

// Simulate API calls
const mockApi = {
  fetchDashboardData: () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        revenue: 125430,
        users: 8472,
        growth: 12.5,
        lastUpdated: new Date().toLocaleString()
      });
    }, 1000);
  }),
  
  fetchTasks: () => new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Review Q4 Report', status: 'pending', priority: 'high' },
        { id: 2, title: 'Update Documentation', status: 'completed', priority: 'medium' },
        { id: 3, title: 'Client Meeting Prep', status: 'in-progress', priority: 'high' }
      ]);
    }, 800);
  }),
  
  searchUsers: (query) => new Promise(resolve => {
    setTimeout(() => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer' }
      ];
      resolve(users.filter(u => 
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      ));
    }, 500);
  })
};

// Reusable Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <Loader className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    onUpdate(task.id, { title });
    setIsEditing(false);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="border rounded-lg p-4 mb-3" copy>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              no-copy
            />
          ) : (
            <h4 className="font-medium">{task.title}</h4>
          )}
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className="text-xs text-gray-500">
              Priority: {task.priority}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4" no-copy>
          {isEditing ? (
            <button onClick={handleSave} className="text-green-600 hover:text-green-800">
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800">
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function ComplexDynamicApp() {
  // Dashboard state
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Report state
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users']);
  const [reportNotes, setReportNotes] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoadingDashboard(true);
      const data = await mockApi.fetchDashboardData();
      setDashboardData(data);
      setIsLoadingDashboard(false);
    };
    loadDashboard();
  }, [refreshCount]);

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true);
      const data = await mockApi.fetchTasks();
      setTasks(data);
      setIsLoadingTasks(false);
    };
    loadTasks();
  }, []);

  // Search users
  useEffect(() => {
    if (searchQuery) {
      const searchTimeout = setTimeout(async () => {
        setIsSearching(true);
        const results = await mockApi.searchUsers(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Task handlers
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        status: 'pending',
        priority: 'medium'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert('Report generated and ready to copy!');
    }, 2000);
  };

  const filteredTasks = showCompletedTasks 
    ? tasks 
    : tasks.filter(t => t.status !== 'completed');

  return (
    <CopyProvider 
      defaultFormat="text"
      onCopySuccess={(content) => {
        console.log('Content copied:', content.substring(0, 100) + '...');
        // Could show a toast notification here
      }}
    >
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold">Dynamic Dashboard Demo</h1>
              <CopyButton variant="minimal" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Dashboard Metrics */}
              <div className="bg-white rounded-lg shadow p-6" copy="1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Dashboard Overview</h2>
                  <button 
                    onClick={() => setRefreshCount(c => c + 1)}
                    className="text-blue-600 hover:text-blue-800"
                    no-copy
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoadingDashboard ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                {isLoadingDashboard ? (
                  <LoadingSpinner />
                ) : dashboardData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold">${dashboardData.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold">{dashboardData.users.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-2xl font-bold">{dashboardData.growth}%</div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="text-sm font-medium">Last Updated</div>
                      <div className="text-xs text-gray-600">{dashboardData.lastUpdated}</div>
                    </div>
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-500" no-copy>
                  Refresh count: {refreshCount}
                </div>
              </div>

              {/* Task Manager */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold" copy="2">Task Manager</h2>
                  <CopyButton className="text-sm" />
                </div>
                
                {/* Add Task Form */}
                <div className="flex gap-2 mb-4" no-copy>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add new task..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter */}
                <label className="flex items-center mb-4 text-sm" no-copy>
                  <input
                    type="checkbox"
                    checked={showCompletedTasks}
                    onChange={(e) => setShowCompletedTasks(e.target.checked)}
                    className="mr-2"
                  />
                  Show completed tasks
                </label>

                {/* Task List */}
                <div copy="3">
                  {isLoadingTasks ? (
                    <LoadingSpinner />
                  ) : filteredTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks found</p>
                  ) : (
                    filteredTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Report Generator */}
              <div className="bg-white rounded-lg shadow p-6" copy="4">
                <h2 className="text-lg font-semibold mb-4">Monthly Report</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Metrics</label>
                    <div className="space-y-2" no-copy>
                      {['revenue', 'users', 'growth', 'tasks'].map(metric => (
                        <label key={metric} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedMetrics.includes(metric)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMetrics([...selectedMetrics, metric]);
                              } else {
                                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                              }
                            }}
                            className="mr-2"
                          />
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Report Notes</label>
                    <textarea
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  {selectedMetrics.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-medium mb-2">Report Summary</h3>
                      <ul className="text-sm space-y-1">
                        {selectedMetrics.includes('revenue') && dashboardData && (
                          <li>Revenue: ${dashboardData.revenue.toLocaleString()}</li>
                        )}
                        {selectedMetrics.includes('users') && dashboardData && (
                          <li>Active Users: {dashboardData.users.toLocaleString()}</li>
                        )}
                        {selectedMetrics.includes('growth') && dashboardData && (
                          <li>Growth Rate: {dashboardData.growth}%</li>
                        )}
                        {selectedMetrics.includes('tasks') && (
                          <li>Total Tasks: {tasks.length} ({tasks.filter(t => t.status === 'completed').length} completed)</li>
                        )}
                      </ul>
                      {reportNotes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm">{reportNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={generateReport}
                    disabled={isGeneratingReport || selectedMetrics.length === 0}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    no-copy
                  >
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* User Search */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">User Search</h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 border rounded-md mb-4"
                  no-copy
                />
                
                <div copy="5">
                  {isSearching ? (
                    <LoadingSpinner />
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map(user => (
                        <div key={user.id} className="p-3 border rounded">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500">Role: {user.role}</div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <p className="text-gray-500 text-center py-4">No users found</p>
                  ) : (
                    <p className="text-gray-400 text-center py-4">Start typing to search</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4" copy="6">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Tasks</span>
                    <span className="font-medium">{tasks.filter(t => t.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-medium">{tasks.filter(t => t.status === 'in-progress').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium">{tasks.filter(t => t.status === 'completed').length}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <CopyButton className="w-full" format="markdown">
                    Copy Stats as Markdown
                  </CopyButton>
                </div>
              </div>

              {/* Copy Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Copy Options</h3>
                <div className="space-y-2">
                  <CopyButton className="w-full" format="text">
                    Copy as Text
                  </CopyButton>
                  <CopyButton className="w-full" format="markdown">
                    Copy as Markdown
                  </CopyButton>
                  <CopyButton className="w-full" format="html">
                    Copy as HTML
                  </CopyButton>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Only content marked with 'copy' attribute will be copied. 
                  Interactive elements are automatically excluded.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Copy Button */}
          <CopyButton
            variant="floating"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onCopy={() => console.log('Copied from floating button!')}
          />
        </div>
      </div>
    </CopyProvider>
  );
}