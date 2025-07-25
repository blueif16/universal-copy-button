# Universal Copy Button 演示网站

本目录包含Universal Copy Button组件的完整演示网站。

## 🌐 在线访问

**演示网站**: https://blueif16.github.io/universal-copy-button

## 📁 项目结构

```
docs/
└── demo/                    # React演示应用
    ├── src/
    │   ├── App.tsx         # 主演示应用
    │   ├── types.d.ts      # TypeScript类型扩展
    │   └── index.css       # Tailwind CSS样式
    ├── public/
    │   └── index.html      # 优化的HTML模板
    └── package.json        # 演示项目配置
```

## 🎯 演示内容

### ✨ 核心功能展示
- **Universal Copy Standard**: 演示copy和no-copy属性的使用
- **实时复制统计**: 显示复制次数和最近复制的内容
- **多种内容类型**: 博客文章、数据报告、任务列表等真实场景

### 🎨 样式变体
- **Glass 样式**: 磨砂玻璃效果，适合大多数场景
- **Tech 样式**: 科技感青蓝渐变，适合开发工具
- **Minimal 样式**: 极简设计，适合内容密集区域
- **Floating 样式**: 浮动按钮，全局页面操作

### 📄 导出格式
- **纯文本**: 默认格式，干净的文本输出
- **Markdown**: 保持标题层级和格式
- **HTML**: 完整的HTML结构

### 🎭 交互特性
- **自适应颜色**: 根据背景自动调整按钮颜色
- **微动画**: 悬停、点击、成功状态的精美动画
- **键盘支持**: 完整的键盘导航和无障碍访问
- **响应式设计**: 移动端和桌面端完美适配

## 🛠️ 本地开发

如果你想在本地运行演示网站：

```bash
# 进入演示目录
cd docs/demo

# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 🚀 部署

演示网站通过GitHub Actions自动部署到GitHub Pages。

每次推送到main分支时，工作流会：
1. 构建React应用
2. 部署到GitHub Pages
3. 更新在线演示网站

## 📱 技术栈

- **React 18**: 现代React hooks和功能
- **TypeScript**: 完整的类型安全
- **Tailwind CSS**: 快速样式开发
- **Lucide React**: 精美的图标库
- **GitHub Pages**: 免费静态网站托管
- **GitHub Actions**: 自动化部署流程

## 🎨 设计理念

演示网站的设计遵循以下原则：

1. **简洁明了**: 清晰展示组件功能而不过度设计
2. **实用导向**: 提供真实的使用场景和示例
3. **交互友好**: 即时反馈和直观的用户体验
4. **响应式**: 在所有设备上都有良好的体验
5. **性能优化**: 快速加载和流畅的动画

## 🔗 相关链接

- [npm包](https://www.npmjs.com/package/universal-copy-button)
- [GitHub仓库](https://github.com/blueif16/universal-copy-button)
- [演示网站](https://blueif16.github.io/universal-copy-button)
- [Universal Copy Standard文档](../universal-copy-standard.md) 