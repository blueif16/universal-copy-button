# Universal Copy Button

一个优雅的React复制按钮组件，支持多种样式变体和自适应设计。基于Universal Copy Standard标准，提供简单易用的API。

![npm version](https://img.shields.io/npm/v/universal-copy-button)
![React](https://img.shields.io/badge/react-%3E%3D16.8.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-supported-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 在线演示

**[👉 查看完整演示网站](https://blueif16.github.io/universal-copy-button)**

体验所有功能，包括不同样式、实时统计和交互演示！

## ✨ 特性

- 🎨 **多种视觉样式**: Glass、Tech、Minimal、Floating四种精美样式
- 🎯 **自适应设计**: 自动适配背景颜色和主题
- 🚀 **即插即用**: 基于Universal Copy Standard，无需配置
- 📱 **响应式**: 完美支持移动端和桌面端
- ♿ **无障碍**: 完整的ARIA支持和键盘导航
- 🎭 **丰富动画**: 精美的微交互和状态指示
- 📄 **多格式导出**: 支持text、markdown、html格式
- 🔧 **TypeScript**: 完整的类型定义

## 📦 安装

```bash
npm install universal-copy-button
# 或
yarn add universal-copy-button
# 或
pnpm add universal-copy-button
```

## 🚀 快速开始

### 1. 标记内容（Universal Copy Standard）

在你想要复制的内容上添加 `copy` 属性：

```html
<article>
  <h1 copy="1">文章标题</h1>
  <p copy="2">这是第一段内容...</p>
  <button no-copy>编辑按钮（不会被复制）</button>
  <p copy="3">这是第二段内容...</p>
</article>
```

### 2. 添加复制按钮

```jsx
import { CopyButton } from 'universal-copy-button';

function App() {
  return (
    <div>
      {/* 你的内容 */}
      <h1 copy="1">欢迎使用</h1>
      <p copy="2">这是一段可复制的内容</p>
      
      {/* 复制按钮 */}
      <CopyButton />
    </div>
  );
}
```

就这么简单！按钮会自动找到所有标记了 `copy` 属性的内容。

## 🎨 样式变体

### Glass（默认）
```jsx
<CopyButton variant="glass" />
```
- 磨砂玻璃效果
- 自适应背景色
- 悬停渐变覆盖

### Tech
```jsx
<CopyButton variant="tech" />
```
- 科技感青蓝渐变
- 软阴影发光效果
- 适合开发工具界面

### Minimal
```jsx
<CopyButton variant="minimal" />
```
- 极简设计
- 悬停前几乎透明
- 适合内容密集区域

### Floating
```jsx
<CopyButton variant="floating" />
```
- 高级玻璃效果
- 渐变光晕
- 适合全局页面操作

## 📖 详细用法

### 基础配置

```jsx
import { CopyButton, CopyProvider } from 'universal-copy-button';

function App() {
  return (
    <CopyProvider
      defaultFormat="markdown"
      defaultSeparator="\n\n"
      onCopySuccess={(text) => console.log('复制成功:', text)}
      onCopyError={(error) => console.error('复制失败:', error)}
    >
      <YourContent />
      <CopyButton />
    </CopyProvider>
  );
}
```

### 自定义样式

```jsx
<CopyButton
  variant="glass"
  className="my-custom-class"
  style={{ position: 'fixed', top: 20, right: 20 }}
  onCopy={(text) => alert('已复制到剪贴板!')}
/>
```

### 仅图标模式

```jsx
<CopyButton iconOnly />
```

### 不同导出格式

```jsx
{/* 纯文本（默认） */}
<CopyButton format="text" />

{/* Markdown格式 */}
<CopyButton format="markdown" />

{/* HTML格式 */}
<CopyButton format="html" />
```

## 🏷️ Universal Copy Standard

本组件基于Universal Copy Standard，使用简单的HTML属性标记内容：

| 属性 | 作用 | 示例 |
|------|------|------|
| `copy` | 标记可复制内容 | `<p copy>内容</p>` |
| `copy="数字"` | 指定复制顺序 | `<h1 copy="1">标题</h1>` |
| `no-copy` | 排除特定内容 | `<button no-copy>按钮</button>` |

### 复制规则

- **默认不复制**: 只有标记了 `copy` 属性的内容才会被复制
- **自动排除交互元素**: `no-copy` 属性可以排除按钮、输入框等
- **DOM顺序**: 没有指定顺序时按DOM顺序复制
- **嵌套支持**: `copy` 元素内的所有内容都会被复制（除非标记 `no-copy`）

## 🎯 实际应用示例

### 博客文章
```html
<article copy>
  <h1>文章标题</h1>
  <p>文章内容第一段...</p>
  <aside no-copy>侧边栏广告</aside>
  <p>文章内容第二段...</p>
  <div no-copy class="actions">
    <button>编辑</button>
    <button>删除</button>
  </div>
</article>
```

### 数据报表
```html
<div class="report" copy>
  <h2>月度销售报告</h2>
  <p>总销售额: ¥125,430</p>
  <p>增长率: +12.5%</p>
  <button no-copy>导出PDF</button>
</div>
```

### 任务列表
```html
<div copy="1">
  <h3>今日任务</h3>
  <div class="task">
    <span>审查Q4报告</span>
    <div no-copy>
      <button>编辑</button>
      <button>删除</button>
    </div>
  </div>
</div>
```

## 🔧 API参考

### CopyButton Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `variant` | `'glass'｜'tech'｜'minimal'｜'floating'` | `'glass'` | 按钮样式变体 |
| `iconOnly` | `boolean` | `false` | 是否只显示图标 |
| `format` | `'text'｜'markdown'｜'html'` | `'text'` | 复制格式 |
| `separator` | `string` | `'\n\n'` | 内容分隔符 |
| `className` | `string` | - | 自定义CSS类 |
| `style` | `CSSProperties` | - | 自定义样式 |
| `onCopy` | `(text: string) => void` | - | 复制成功回调 |
| `onCopyError` | `(error: Error) => void` | - | 复制失败回调 |

### CopyProvider Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `defaultFormat` | `'text'｜'markdown'｜'html'` | `'text'` | 默认复制格式 |
| `defaultSeparator` | `string` | `'\n\n'` | 默认分隔符 |
| `onCopySuccess` | `(text: string) => void` | - | 全局复制成功回调 |
| `onCopyError` | `(error: Error) => void` | - | 全局复制失败回调 |

## 🎨 自定义样式

组件完全支持Tailwind CSS和自定义CSS。你可以通过 `className` 和 `style` 属性进行样式定制：

```jsx
<CopyButton
  variant="glass"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
  style={{ 
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)' 
  }}
/>
```

## 🌟 最佳实践

1. **语义化标记**: 使用 `copy` 属性明确标记需要复制的内容
2. **排除交互元素**: 用 `no-copy` 排除按钮、输入框等交互元素  
3. **合理分组**: 按逻辑分组使用数字顺序 `copy="1"`、`copy="2"`
4. **响应式设计**: 在移动端考虑使用 `iconOnly` 节省空间
5. **用户反馈**: 提供复制成功/失败的视觉或音频反馈

## 🚀 浏览器支持

- Chrome >= 63
- Firefox >= 67  
- Safari >= 13.1
- Edge >= 79

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📮 支持

如果你觉得这个项目有用，请给一个⭐️！

有问题？[提交Issue](https://github.com/blueif16/universal-copy-button/issues) 