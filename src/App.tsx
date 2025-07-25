import React, { useState } from 'react';
import { CopyButton, CopyProvider } from 'universal-copy-button';
import { Github, ExternalLink, Star, Download, Zap, Copy, CheckCircle, XCircle } from 'lucide-react';
import './App.css';

function App() {
  const [copyCount, setCopyCount] = useState(0);
  const [lastCopiedContent, setLastCopiedContent] = useState('');

  const handleCopySuccess = (content: string) => {
    setCopyCount(prev => prev + 1);
    setLastCopiedContent(content.substring(0, 100) + (content.length > 100 ? '...' : ''));
  };

  return (
    <CopyProvider 
      defaultFormat="text"
      defaultSeparator="\n\n"
      onCopySuccess={handleCopySuccess}
      onCopyError={(error) => console.error('Copy failed:', error)}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6" copy="1">
                Universal Copy Button
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100" copy="2">
                优雅的React复制按钮组件，支持多种样式和自适应设计
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                  href="https://www.npmjs.com/package/universal-copy-button"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  no-copy
                >
                  <Download className="w-5 h-5 mr-2" />
                  npm install universal-copy-button
                </a>
                <a
                  href="https://github.com/blueif16/universal-copy-button"
                  className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  no-copy
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </a>
              </div>
              <div className="flex justify-center">
                <CopyButton 
                  variant="glass" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  复制页面标题内容
                </CopyButton>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" copy="3">
              ✨ 核心特性
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" copy="4">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Copy className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">零配置使用</h3>
                <p className="text-gray-600">基于Universal Copy Standard，只需添加copy属性即可</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">多种样式</h3>
                <p className="text-gray-600">Glass、Tech、Minimal、Floating四种精美样式</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">自适应设计</h3>
                <p className="text-gray-600">自动适配背景色，完美融入任何设计</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">TypeScript</h3>
                <p className="text-gray-600">完整的类型定义，开发体验更佳</p>
              </div>
            </div>
          </div>
        </section>

        {/* Copy Stats */}
        {copyCount > 0 && (
          <section className="py-8 bg-green-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-4 text-green-700">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  您已成功复制 {copyCount} 次内容！
                </span>
              </div>
              {lastCopiedContent && (
                <p className="mt-2 text-sm text-green-600">
                  最近复制: "{lastCopiedContent}"
                </p>
              )}
            </div>
          </section>
        )}

        {/* Demo Sections */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" copy="5">
              🎨 样式展示
            </h2>

            {/* Glass Variant */}
            <div className="mb-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800" copy="6">
                Glass 样式（默认）
              </h3>
              <p className="text-gray-600 mb-6" copy="7">
                磨砂玻璃效果，自动适配背景颜色，悬停时显示渐变覆盖层。适合大多数场景使用。
              </p>
              <div className="flex gap-4 flex-wrap">
                <CopyButton variant="glass">
                  Glass 样式
                </CopyButton>
                <CopyButton variant="glass" iconOnly />
              </div>
            </div>

            {/* Tech Variant */}
            <div className="mb-16 p-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800" copy="8">
                Tech 样式
              </h3>
              <p className="text-gray-600 mb-6" copy="9">
                科技感青蓝渐变，带有软阴影发光效果。适合技术类网站和开发工具界面。
              </p>
              <div className="flex gap-4 flex-wrap">
                <CopyButton variant="tech">
                  Tech 样式
                </CopyButton>
                <CopyButton variant="tech" iconOnly />
              </div>
            </div>

            {/* Minimal Variant */}
            <div className="mb-16 p-8 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800" copy="10">
                Minimal 样式
              </h3>
              <p className="text-gray-600 mb-6" copy="11">
                极简设计，悬停前几乎透明。适合内容密集的区域，不会干扰阅读体验。
              </p>
              <div className="flex gap-4 flex-wrap">
                <CopyButton variant="minimal">
                  Minimal 样式
                </CopyButton>
                <CopyButton variant="minimal" iconOnly />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" copy="12">
              🚀 互动演示
            </h2>

            {/* Blog Post Example */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <article>
                <h3 className="text-2xl font-bold mb-4 text-gray-800" copy="13">
                  如何使用Universal Copy Button？
                </h3>
                <p className="text-gray-600 mb-4" copy="14">
                  Universal Copy Button基于Universal Copy Standard，使用极其简单。
                  只需要在想要复制的内容上添加<code className="bg-gray-100 px-2 py-1 rounded">copy</code>属性即可。
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4" no-copy>
                  <p className="text-sm text-gray-600 mb-2">代码示例（此区域不会被复制）：</p>
                  <pre className="text-sm"><code>{`<h1 copy="1">文章标题</h1>
<p copy="2">文章内容</p>
<button no-copy>编辑按钮</button>
<CopyButton />`}</code></pre>
                </div>
                <p className="text-gray-600 mb-6" copy="15">
                  使用<code className="bg-gray-100 px-2 py-1 rounded">no-copy</code>属性可以排除不需要复制的交互元素，
                  如按钮、输入框等。这样复制的内容就是纯净的文本，非常适合分享。
                </p>
                <div className="flex gap-4 items-center" no-copy>
                  <CopyButton>复制文章内容</CopyButton>
                  <span className="text-sm text-gray-500">
                    尝试复制这篇文章，按钮和代码示例不会被包含
                  </span>
                </div>
              </article>
            </div>

            {/* Data Report Example */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8" copy="16">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">📊 数据报告示例</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">活跃用户</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">89.2%</div>
                  <div className="text-sm text-gray-600">满意度</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">新功能请求</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                本月数据显示用户活跃度持续上升，产品满意度保持在高水平。
                用户反馈积极，新功能请求数量稳定增长。
              </p>
              <div className="flex gap-4 items-center" no-copy>
                <CopyButton format="markdown">复制为Markdown</CopyButton>
                <CopyButton format="text">复制为纯文本</CopyButton>
                <span className="text-sm text-gray-500">支持多种格式复制</span>
              </div>
            </div>

            {/* Task List Example */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800" copy="17">
                ✅ 任务清单示例
              </h3>
              <div className="space-y-3" copy="18">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span>完成Universal Copy Button组件开发</span>
                  <div className="ml-auto" no-copy>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">编辑</button>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span>创建演示文档网站</span>
                  <div className="ml-auto" no-copy>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">编辑</button>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                  <span>发布到npm包管理器</span>
                  <div className="ml-auto" no-copy>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">编辑</button>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                  <span>收集用户反馈并迭代</span>
                  <div className="ml-auto" no-copy>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">编辑</button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4 items-center" no-copy>
                <CopyButton>复制任务清单</CopyButton>
                <span className="text-sm text-gray-500">
                  编辑按钮不会被复制，只复制任务内容
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Installation & Usage */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12" copy="19">
              🛠️ 安装和使用
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6" copy="20">
                <h3 className="text-xl font-semibold mb-4">安装</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <code className="text-green-400">npm install universal-copy-button</code>
                </div>
                <p className="text-gray-300">
                  支持npm、yarn、pnpm等主流包管理器，兼容React 16.8+版本。
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6" copy="21">
                <h3 className="text-xl font-semibold mb-4">基础使用</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-300"><code>{`import { CopyButton } from 'universal-copy-button';

<h1 copy="1">标题</h1>
<p copy="2">内容</p>
<CopyButton />`}</code></pre>
                </div>
                <p className="text-gray-300">
                  只需三行代码即可实现强大的复制功能。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8" copy="22">
              <h3 className="text-2xl font-bold mb-4">Universal Copy Button</h3>
              <p className="text-gray-300">
                让复制变得简单而优雅 - Created by Shiran Wang
              </p>
            </div>
            <div className="flex justify-center gap-6 mb-8" no-copy>
              <a
                href="https://www.npmjs.com/package/universal-copy-button"
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/blueif16/universal-copy-button"
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              MIT License © 2024
            </div>
          </div>
        </footer>

        {/* Floating Copy Button */}
        <CopyButton
          variant="floating"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl"
        />
      </div>
    </CopyProvider>
  );
}

export default App; 