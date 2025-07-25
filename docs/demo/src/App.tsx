import React, { useState } from 'react';
import { Copy, Check, Github, Star, Download, Code } from 'lucide-react';
import './App.css';

// 类型定义
interface CopyButtonProps {
  variant?: 'glass' | 'tech' | 'minimal' | 'floating';
  iconOnly?: boolean;
  format?: 'text' | 'markdown' | 'html';
  onCopy?: (content: string) => void;
  children?: React.ReactNode;
  className?: string;
}

// 简化版CopyButton组件用于演示
const CopyButton: React.FC<CopyButtonProps> = ({ 
  variant = 'glass', 
  iconOnly = false, 
  format = 'text', 
  onCopy, 
  children, 
  className = '' 
}) => {
  const [state, setState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  
  const handleCopy = async () => {
    setState('copying');
    
    try {
      const elements = document.querySelectorAll('[copy]');
      const content = Array.from(elements)
        .map(el => {
          const clone = el.cloneNode(true) as Element;
          clone.querySelectorAll('[no-copy]').forEach((nc: Element) => nc.remove());
          return clone.textContent?.trim() || '';
        })
        .join('\n\n');
      
      await navigator.clipboard.writeText(content);
      setState('success');
      onCopy?.(content);
      
      setTimeout(() => setState('idle'), 2000);
    } catch (err) {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const getVariantClass = () => {
    const base = `inline-flex items-center justify-center transition-all duration-300 cursor-pointer border`;
    const sizes = iconOnly ? 'p-2.5' : 'px-5 py-2.5';
    
    switch (variant) {
      case 'glass':
        return `${base} ${sizes} rounded-xl bg-black/5 hover:bg-black/10 backdrop-blur-md border-gray-900/10 shadow-lg hover:shadow-xl`;
      case 'tech':
        return `${base} ${sizes} rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-700 border-cyan-500/20 shadow-lg`;
      case 'minimal':
        return `${base} ${sizes} rounded-lg text-gray-600 hover:text-gray-900 hover:bg-black/5 border-transparent`;
      case 'floating':
        return `${base} ${sizes} rounded-2xl bg-black/5 hover:bg-black/10 backdrop-blur-xl border-gray-900/10 shadow-2xl`;
      default:
        return `${base} ${sizes} rounded-lg bg-gray-100 hover:bg-gray-200`;
    }
  };

  const icons: Record<string, React.ReactElement> = {
    idle: <Copy className="w-4 h-4" />,
    copying: <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />,
    success: <Check className="w-4 h-4" />,
    error: <Copy className="w-4 h-4" />
  };

  const labels: Record<string, React.ReactNode> = {
    idle: children || 'Copy',
    copying: 'Copying...',
    success: 'Copied!',
    error: 'Error!'
  };

  return (
    <button 
      onClick={handleCopy}
      className={`${getVariantClass()} ${className}`}
      disabled={state !== 'idle'}
    >
      {iconOnly ? (
        icons[state]
      ) : (
        <>
          <span className="mr-2">{icons[state]}</span>
          <span>{labels[state]}</span>
        </>
      )}
    </button>
  );
};

function App() {
  const [activeDemo, setActiveDemo] = useState('basic');
  const [copyCount, setCopyCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Universal Copy Button</h1>
              <p className="text-sm text-gray-600">优雅的React复制按钮组件</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Star className="w-4 h-4" />
              <span>Star</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              简单标记，
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                一键复制
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              基于Universal Copy Standard标准，只需在HTML元素上添加 <code className="px-2 py-1 bg-gray-100 rounded text-sm">copy</code> 属性，
              即可实现智能内容识别和优雅的复制体验。
            </p>
            
            {/* Live Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-semibold mb-4">🚀 即时演示</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-left">
                  <h4 {...({'copy': '1'} as any)} className="text-2xl font-bold text-gray-900 mb-3">产品介绍</h4>
                  <p {...({'copy': '2'} as any)} className="text-gray-600 mb-4">
                    Universal Copy Button是一个优雅的React组件，支持多种视觉样式和自适应设计。
                    通过简单的HTML属性标记，实现智能内容识别和复制。
                  </p>
                  <div {...({'copy': '3'} as any)} className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">核心特性</h5>
                    <ul className="text-blue-800 space-y-1">
                      <li>• 四种精美样式变体</li>
                      <li>• 自适应背景色检测</li>
                      <li>• 完整的TypeScript支持</li>
                    </ul>
                    <button {...({'no-copy': true} as any)} className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm">
                      了解更多
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  <p className="text-sm text-gray-500 mb-2">
                    点击按钮复制左侧内容 (复制次数: {copyCount})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <CopyButton 
                      variant="glass" 
                      onCopy={() => setCopyCount(c => c + 1)}
                    >
                      Glass
                    </CopyButton>
                    <CopyButton 
                      variant="tech" 
                      onCopy={() => setCopyCount(c => c + 1)}
                    >
                      Tech
                    </CopyButton>
                    <CopyButton 
                      variant="minimal" 
                      onCopy={() => setCopyCount(c => c + 1)}
                    >
                      Minimal
                    </CopyButton>
                    <CopyButton 
                      variant="floating" 
                      onCopy={() => setCopyCount(c => c + 1)}
                    >
                      Floating
                    </CopyButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">核心功能</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎨",
                title: "多种样式",
                desc: "Glass、Tech、Minimal、Floating四种精美样式"
              },
              {
                icon: "🎯",
                title: "智能识别",
                desc: "基于copy属性自动识别可复制内容"
              },
              {
                icon: "🚀",
                title: "即插即用",
                desc: "零配置，添加组件即可使用"
              },
              {
                icon: "📱",
                title: "响应式",
                desc: "完美适配移动端和桌面端"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Demos */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">交互演示</h3>
          
          {/* Demo Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg">
              {[
                { id: 'basic', label: '基础用法' },
                { id: 'formats', label: '格式演示' },
                { id: 'advanced', label: '高级特性' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemo(tab.id)}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    activeDemo === tab.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {activeDemo === 'basic' && (
              <div className="p-8">
                <h4 className="text-xl font-semibold mb-6">基础标记演示</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-semibold mb-3">HTML结构</h5>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<article>
  <h1 copy="1">文章标题</h1>
  <p copy="2">第一段内容...</p>
  <button no-copy>编辑</button>
  <p copy="3">第二段内容...</p>
</article>`}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">实际效果</h5>
                    <article className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                      <h1 {...({'copy': '1'} as any)} className="text-lg font-bold text-gray-900 mb-2">智能复制演示</h1>
                      <p {...({'copy': '2'} as any)} className="text-gray-700 mb-2">这是第一段可复制的内容，包含产品的基本介绍信息。</p>
                      <button {...({'no-copy': true} as any)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm mb-2">
                        编辑按钮 (不会被复制)
                      </button>
                      <p {...({'copy': '3'} as any)} className="text-gray-700">这是第二段内容，展示了多段落的复制效果。</p>
                    </article>
                    <div className="mt-4 flex justify-center">
                      <CopyButton>试试复制上面的内容</CopyButton>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'formats' && (
              <div className="p-8">
                <h4 className="text-xl font-semibold mb-6">多格式输出演示</h4>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h1 {...({'copy': '1'} as any)} className="text-xl font-bold mb-2">Markdown演示</h1>
                    <h2 {...({'copy': '2'} as any)} className="text-lg font-semibold mb-2">二级标题</h2>
                    <p {...({'copy': '3'} as any)} className="text-gray-700 mb-2">这是一个段落内容，将会被转换为Markdown格式。</p>
                    <ul>
                      <li {...({'copy': '4'} as any)}>列表项目一</li>
                      <li {...({'copy': '5'} as any)}>列表项目二</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <CopyButton format="text">纯文本格式</CopyButton>
                    <CopyButton format="markdown">Markdown格式</CopyButton>
                    <CopyButton format="html">HTML格式</CopyButton>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'advanced' && (
              <div className="p-8">
                <h4 className="text-xl font-semibold mb-6">高级特性演示</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-semibold mb-3">图标模式</h5>
                    <div className="flex space-x-3 mb-6">
                      <CopyButton variant="glass" iconOnly />
                      <CopyButton variant="tech" iconOnly />
                      <CopyButton variant="minimal" iconOnly />
                    </div>
                    
                    <h5 className="font-semibold mb-3">自定义样式</h5>
                    <CopyButton 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 hover:from-pink-600 hover:to-purple-700"
                    >
                      自定义渐变
                    </CopyButton>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">复制内容预览</h5>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div {...({'copy': true} as any)} className="space-y-2">
                        <h6 className="font-semibold">产品数据</h6>
                        <p>销售额: ¥125,430</p>
                        <p>增长率: +12.5%</p>
                        <button {...({'no-copy': true} as any)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                          导出报告
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">快速开始</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  安装
                </h4>
                <pre className="bg-black/30 p-4 rounded-lg text-sm">
                  <code>npm install universal-copy-button</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  使用
                </h4>
                <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-x-auto">
{`import { CopyButton } from 'universal-copy-button';

<CopyButton variant="glass" />`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <p className="mb-2">基于 Universal Copy Standard 构建</p>
          <p className="text-sm">MIT License • 支持现代浏览器</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
